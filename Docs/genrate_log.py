from __future__ import annotations
import argparse
from datetime import date
from pathlib import Path
from typing import Iterable


DOCS_DIR = Path(__file__).resolve().parent
MASTER_CONTEXT_PATH = DOCS_DIR / "MASTER_CODEX_CONTEXT.md"
UPDATES_PATH = DOCS_DIR / "updates.MD"
PROJECT_ROOT = DOCS_DIR.parent
IGNORED_PARTS = {
    ".git",
    "__pycache__",
    "node_modules",
    "venv",
    ".venv",
    "dist",
    "build",
    ".pytest_cache",
}
SELF_MANAGED_DOCS = {
    MASTER_CONTEXT_PATH.name,
    UPDATES_PATH.name,
    Path(__file__).resolve().name,
}


def _normalize_work_items(work_done: str | Iterable[str]) -> list[str]:
    if isinstance(work_done, str):
        items = [line.strip(" -") for line in work_done.splitlines() if line.strip()]
    else:
        items = [str(item).strip() for item in work_done if str(item).strip()]

    if not items:
        raise ValueError("work_done must contain at least one non-empty item.")

    return items


def infer_next_work_from_context(context_path: Path = MASTER_CONTEXT_PATH) -> str:
    context = context_path.read_text(encoding="utf-8")
    lines = [line.strip() for line in context.splitlines()]

    in_development_order = False
    current_phase: str | None = None
    current_tasks: list[tuple[str, bool]] = []
    phases: list[tuple[str, list[tuple[str, bool]]]] = []

    for line in lines:
        if line == "# Development Order":
            in_development_order = True
            continue

        if not in_development_order:
            continue

        if line == "---" and phases:
            break

        if line.startswith("Phase "):
            if current_phase is not None:
                phases.append((current_phase, current_tasks))
            current_phase = line
            current_tasks = []
            continue

        if line.startswith("✔") or line.startswith("- [ ]") or line.startswith("- [x]"):
            is_done = line.startswith("✔") or line.startswith("- [x]")
            task_name = (
                line.removeprefix("✔").removeprefix("- [ ]").removeprefix("- [x]").strip()
            )
            current_tasks.append((task_name, is_done))

    if current_phase is not None:
        phases.append((current_phase, current_tasks))

    for phase_name, tasks in phases:
        if not tasks:
            return f"{phase_name}: define the concrete work items."

        if not all(done for _, done in tasks):
            pending_tasks = [task for task, done in tasks if not done]
            pending_summary = ", ".join(pending_tasks)
            return f"{phase_name}: work on {pending_summary}."

    return "Review the completed phases, stabilize the project, and plan the next milestone."


def _should_ignore_path(path: Path) -> bool:
    return any(part in IGNORED_PARTS for part in path.parts)


def _is_self_managed_file(path: Path) -> bool:
    return path.parent == DOCS_DIR and path.name in SELF_MANAGED_DOCS


def _describe_file_work(path: Path) -> str:
    relative_path = path.relative_to(PROJECT_ROOT)
    stem = path.stem.replace("_", " ").replace("-", " ").strip()
    suffix = path.suffix.lower()

    if relative_path.name in {"package.json", "package-lock.json", "requirements.txt"}:
        return f"Updated project dependencies in {relative_path}."

    if relative_path.name.startswith("README") or suffix == ".md":
        return f"Updated documentation in {relative_path}."

    if "migrations" in relative_path.parts:
        return f"Created or updated database migration {relative_path.name}."

    if suffix == ".py":
        return f"Worked on Python module {relative_path} ({stem})."

    if suffix in {".js", ".jsx", ".ts", ".tsx"}:
        return f"Worked on frontend module {relative_path} ({stem})."

    if suffix in {".json", ".yml", ".yaml", ".toml", ".ini"}:
        return f"Updated configuration file {relative_path}."

    return f"Modified {relative_path}."


def collect_todays_work(
    *,
    target_date: date | None = None,
    project_root: Path = PROJECT_ROOT,
) -> list[str]:
    day = target_date or date.today()
    work_items: list[str] = []

    for path in sorted(project_root.rglob("*")):
        if not path.is_file():
            continue
        if _should_ignore_path(path):
            continue

        modified_day = date.fromtimestamp(path.stat().st_mtime)
        if modified_day != day:
            continue

        if _is_self_managed_file(path):
            continue

        work_items.append(_describe_file_work(path))

    return work_items


def find_latest_work_date(project_root: Path = PROJECT_ROOT) -> date | None:
    latest_date: date | None = None

    for path in project_root.rglob("*"):
        if not path.is_file():
            continue
        if _should_ignore_path(path) or _is_self_managed_file(path):
            continue

        modified_day = date.fromtimestamp(path.stat().st_mtime)
        if latest_date is None or modified_day > latest_date:
            latest_date = modified_day

    return latest_date


def infer_next_work_from_files(
    work_items: Iterable[str],
    context_path: Path = MASTER_CONTEXT_PATH,
) -> str:
    items = list(work_items)
    lowered = " ".join(items).lower()

    if "frontend module" in lowered or "src/" in lowered or "app.jsx" in lowered:
        return "Test the frontend changes in the browser and connect any missing API responses."

    if "python module" in lowered or "migration" in lowered:
        return "Run the Django flow end-to-end and add tests for the backend changes."

    if "documentation" in lowered:
        return "Apply the documented plan in code and verify the implementation matches the docs."

    return infer_next_work_from_context(context_path)


def update_daily_progress(
    work_done: str | Iterable[str],
    *,
    next_work: str | None = None,
    update_date: date | None = None,
    updates_path: Path = UPDATES_PATH,
    context_path: Path = MASTER_CONTEXT_PATH,
) -> str:
    items = _normalize_work_items(work_done)
    target_date = update_date or date.today()
    suggested_next_work = next_work or infer_next_work_from_context(context_path)

    if updates_path.exists():
        existing_content = updates_path.read_text(encoding="utf-8").rstrip()
    else:
        existing_content = ""

    header = "# Daily Updates\n"
    entry_lines = [
        f"## {target_date.isoformat()}",
        "",
        "### Work Done",
        *[f"- {item}" for item in items],
        "",
        "### Next Work",
        f"- {suggested_next_work}",
    ]
    entry = "\n".join(entry_lines)

    if not existing_content:
        new_content = f"{header}\n{entry}\n"
    else:
        prefix = existing_content
        if not prefix.startswith("# Daily Updates"):
            prefix = f"{header}\n{prefix}"
        new_content = f"{prefix}\n\n{entry}\n"

    updates_path.write_text(new_content, encoding="utf-8")
    return suggested_next_work


def auto_update_daily_progress(
    *,
    update_date: date | None = None,
    updates_path: Path = UPDATES_PATH,
    context_path: Path = MASTER_CONTEXT_PATH,
    project_root: Path = PROJECT_ROOT,
) -> str:
    target_date = update_date or date.today()
    work_items = collect_todays_work(target_date=target_date, project_root=project_root)

    if not work_items:
        fallback_date = find_latest_work_date(project_root=project_root)
        if fallback_date is None:
            raise ValueError("No project files were found to generate a daily log.")

        target_date = fallback_date
        work_items = collect_todays_work(target_date=target_date, project_root=project_root)

    if not work_items:
        raise ValueError(
            "Could not derive any completed work from the project files."
        )

    next_work = infer_next_work_from_files(work_items, context_path=context_path)
    return update_daily_progress(
        work_items,
        next_work=next_work,
        update_date=target_date,
        updates_path=updates_path,
        context_path=context_path,
    )


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Append today's completed work and next step to Docs/updates.MD."
    )
    parser.add_argument(
        "--work",
        action="append",
        help="A completed task. Repeat this flag for multiple items.",
    )
    parser.add_argument(
        "--next-work",
        help="Optional manual next step. If omitted, it is inferred from MASTER_CODEX_CONTEXT.md.",
    )
    parser.add_argument(
        "--date",
        dest="entry_date",
        help="Optional date in YYYY-MM-DD format. Defaults to today.",
    )
    parser.add_argument(
        "--auto",
        action="store_true",
        help="Generate today's work automatically from files modified today.",
    )
    return parser


def main() -> None:
    parser = _build_parser()
    args = parser.parse_args()
    parsed_date = date.fromisoformat(args.entry_date) if args.entry_date else None

    if args.auto:
        next_work = auto_update_daily_progress(update_date=parsed_date)
    else:
        if not args.work:
            parser.error("the following arguments are required: --work (unless --auto is used)")
        next_work = update_daily_progress(
            args.work,
            next_work=args.next_work,
            update_date=parsed_date,
        )
    print(f"updates.MD updated. Next work: {next_work}")


if __name__ == "__main__":
    main()
