#!/usr/bin/env python3
"""Compute statement volume (counts per source/day) from the remote Supabase 'analyses' table."""

import argparse
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from collections import defaultdict

TABLE = "analyses"
PAGE_SIZE = 1000


def get_config():
    url = os.environ.get("SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    key = (
        os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        or os.environ.get("SUPABASE_KEY")
        or os.environ.get("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")
    )
    if not url or not key:
        sys.exit(
            "Missing Supabase config. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY "
            "(a service-role key is required to write volume data back to analyses.output)."
        )
    return url.rstrip("/"), key


def fetch_analyses(base_url, key, limit):
    rows = []
    offset = 0
    headers = {"apikey": key, "Authorization": f"Bearer {key}"}
    while len(rows) < limit:
        page_limit = min(PAGE_SIZE, limit - len(rows))
        params = urllib.parse.urlencode({
            "select": "id,created_at,raw_statements,output",
            "order": "created_at.desc",
            "limit": page_limit,
            "offset": offset,
        })
        req = urllib.request.Request(f"{base_url}/rest/v1/{TABLE}?{params}", headers=headers)
        try:
            with urllib.request.urlopen(req) as resp:
                page = json.loads(resp.read())
        except urllib.error.HTTPError as e:
            sys.exit(f"Supabase fetch failed: {e.code} {e.reason} — {e.read().decode(errors='replace')}")
        except urllib.error.URLError as e:
            sys.exit(f"Could not reach Supabase at {base_url}: {e.reason}")
        if not page:
            break
        rows.extend(page)
        offset += len(page)
        if len(page) < page_limit:
            break
    return rows


def compute_volume(row):
    statements = row.get("raw_statements") or []
    by_source = defaultdict(int)
    by_day = defaultdict(int)
    for s in statements:
        by_source[s.get("source") or "unknown"] += 1
        by_day[(s.get("date") or "")[:10] or "unknown"] += 1
    return {
        "total": len(statements),
        "by_source": dict(by_source),
        "by_day": dict(sorted(by_day.items())),
    }


def print_report(rows, volumes):
    total = sum(v["total"] for v in volumes)
    source_totals = defaultdict(int)
    day_totals = defaultdict(int)
    for v in volumes:
        for src, count in v["by_source"].items():
            source_totals[src] += count
        for day, count in v["by_day"].items():
            day_totals[day] += count

    print(f"Analyzed {len(rows)} run(s), {total} statement(s) total\n")

    print("By source:")
    for src in sorted(source_totals, key=lambda s: -source_totals[s]):
        pct = (source_totals[src] / total * 100) if total else 0
        print(f"  {src:<15} {source_totals[src]:>6}  ({pct:5.1f}%)")

    if day_totals:
        print("\nBy day (most recent 14):")
        for day in sorted(day_totals)[-14:]:
            print(f"  {day}  {day_totals[day]}")


def write_volumes(base_url, key, rows, volumes):
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }
    for row, volume in zip(rows, volumes):
        output = dict(row.get("output") or {})
        output["volume"] = volume
        body = json.dumps({"output": output}).encode()
        params = urllib.parse.urlencode({"id": f"eq.{row['id']}"})
        req = urllib.request.Request(
            f"{base_url}/rest/v1/{TABLE}?{params}", data=body, headers=headers, method="PATCH"
        )
        try:
            urllib.request.urlopen(req)
        except urllib.error.HTTPError as e:
            sys.exit(f"Supabase write failed for run {row['id']}: {e.code} {e.reason} — {e.read().decode(errors='replace')}")
        except urllib.error.URLError as e:
            sys.exit(f"Could not reach Supabase at {base_url}: {e.reason}")
    print(f"\nWrote volume metrics to {len(rows)} run(s).")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--limit", type=int, default=500, help="Max analysis runs to pull (default: 500)")
    parser.add_argument(
        "--write", action="store_true",
        help="Persist computed volume metrics back to Supabase (default: dry run, report only)",
    )
    args = parser.parse_args()

    base_url, key = get_config()
    rows = fetch_analyses(base_url, key, args.limit)

    if not rows:
        print("No analysis runs found.")
        return

    volumes = [compute_volume(row) for row in rows]
    print_report(rows, volumes)

    if args.write:
        write_volumes(base_url, key, rows, volumes)
    else:
        print("\nDry run — no changes written. Pass --write to persist volume metrics to Supabase.")


if __name__ == "__main__":
    main()
