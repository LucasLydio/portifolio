#!/usr/bin/env python3
"""
create_portfolio_structure.py

Cria a estrutura (pastas + arquivos vazios) exatamente como no seu diagrama.

Uso:
  python create_portfolio_structure.py

Opções:
  python create_portfolio_structure.py --root .
  python create_portfolio_structure.py --root MeuProjeto
  python create_portfolio_structure.py --base /caminho/onde/criar
  python create_portfolio_structure.py --force
"""

from __future__ import annotations

import argparse
from pathlib import Path
import sys


DIRS = [
    ".github",
    "netlify/functions/_shared",
    "src/pages",
    "src/components",
    "src/data",
    "src/assets/img",
    "src/assets/icons",
    "src/styles",
    "src/scripts/modules",
    # dist (gerado) — mantemos como pasta, mas você pode remover daqui se quiser
    "dist/css",
    "dist/js",
    "dist/assets",
]

FILES = [
    ".github/CODEOWNERS",
    "netlify/functions/getIndex.js",
    "netlify/functions/_shared/response.js",
    "netlify/functions/_shared/templates.js",
    "src/pages/index.njk",
    "src/components/header.njk",
    "src/components/footer.njk",
    "src/components/project-card.njk",
    "src/data/site.json",
    "src/data/projects.json",
    "src/styles/tokens.css",
    "src/styles/base.css",
    "src/styles/components.css",
    "src/styles/index.css",
    "src/scripts/main.js",
    "src/scripts/modules/dom.js",
    "src/scripts/modules/projects.js",
    "src/scripts/modules/theme.js",
    # dist (gerado / deploy)
    "dist/index.html",
    # raiz
    ".env",
    ".env.example",
    ".gitignore",
    "netlify.toml",
    "package.json",
    "README.md",
]


def ensure_dirs(root: Path) -> None:
    for d in DIRS:
        (root / d).mkdir(parents=True, exist_ok=True)


def ensure_files(root: Path) -> list[Path]:
    created: list[Path] = []
    for f in FILES:
        p = root / f
        p.parent.mkdir(parents=True, exist_ok=True)
        if not p.exists():
            p.write_text("", encoding="utf-8")
            created.append(p)
    return created


def main() -> int:
    parser = argparse.ArgumentParser(description="Cria estrutura de portfólio (Netlify + Nunjucks).")
    parser.add_argument(
        "--root",
        default=".",
        help="Pasta raiz do projeto (default: .). Use um nome para criar uma pasta nova.",
    )
    parser.add_argument(
        "--base",
        default=".",
        help="Diretório base onde a pasta root será criada (default: diretório atual).",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Permite usar uma pasta root já existente (senão, aborta).",
    )
    args = parser.parse_args()

    base = Path(args.base).expanduser().resolve()
    root = (base / args.root).resolve()

    if root.exists() and args.root not in (".", "./") and not args.force:
        print(f"Erro: '{root}' já existe. Use --force para criar apenas o que faltar.", file=sys.stderr)
        return 1

    root.mkdir(parents=True, exist_ok=True)
    ensure_dirs(root)
    created_files = ensure_files(root)

    print(f"✅ Estrutura criada em: {root}")
    print(f"📁 Pastas garantidas: {len(DIRS)}")
    print(f"📄 Arquivos criados: {len(created_files)} (não sobrescreve existentes)")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
