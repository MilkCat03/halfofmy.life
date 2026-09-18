#!/usr/bin/env python3

import subprocess
from html import escape
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent
OUTPUT_FILE = REPO_ROOT / "git_changelog.html"


def run_git(*args):
    result = subprocess.run(
        ["git", *args],
        cwd=str(REPO_ROOT),
        capture_output=True,
        text=True,
        encoding="utf-8",
        check=True,
    )
    return result.stdout


def get_commits():
    raw = run_git(
        "--no-pager",
        "log",
        "--pretty=format:%H%x1f%ad%x1f%s%x1e",
        "--date=short",
    )

    commits = []
    for entry in raw.split("\x1e"):
        entry = entry.strip()
        if not entry:
            continue

        parts = entry.split("\x1f")
        if len(parts) < 3:
            continue

        sha, date, message = parts[:3]
        files = run_git(
            "--no-pager",
            "show",
            "--pretty=format:",
            "--name-only",
            "--no-renames",
            sha,
        ).splitlines()
        files = [line.strip() for line in files if line.strip()]

        commits.append({
            "sha": sha,
            "date": date,
            "message": message,
            "files": files,
        })

    return commits


def render_html(commits):
    list_items = []
    for commit in commits:
        file_list = "".join(f"<li>{escape(path)}</li>" for path in commit["files"]) or "<li>No files listed</li>"
        list_items.append(
            f"<li><strong>{escape(commit['date'])}</strong> — &quot;{escape(commit['message'])}&quot;<ul>{file_list}</ul></li>"
        )

    commit_html = "\n".join(list_items)
    return f"""<!DOCTYPE html>
<html lang=\"en\">
<head>
    <meta charset=\"UTF-8\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
    <title>Git Changelog</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 2rem;
            background: #f7f7f7;
            color: #111;
        }}
        h1 {{
            margin-bottom: 1rem;
        }}
        ul {{
            line-height: 1.6;
        }}
        li ul {{
            margin-top: 0.3rem;
            margin-bottom: 0.8rem;
        }}
        .meta {{
            color: #444;
        }}
    </style>
</head>
<body>
    <h1>Git Changelog</h1>
    <ul>
        {commit_html}
    </ul>
</body>
</html>
"""


if __name__ == "__main__":
    commits = get_commits()
    html = render_html(commits)
    OUTPUT_FILE.write_text(html, encoding="utf-8")
    print(f"Saved git changelog to {OUTPUT_FILE}")