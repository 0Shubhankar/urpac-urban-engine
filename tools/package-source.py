"""Create a portable source archive; no machine paths, dependencies or build caches."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root = Path(__file__).resolve().parents[1]
excluded = {'node_modules', '.git', 'dist', 'work', '__pycache__'}
with ZipFile(root / 'UUE_v0.1_Source.zip', 'w', ZIP_DEFLATED) as archive:
    for path in sorted(root.rglob('*')):
        relative = path.relative_to(root)
        if not path.is_file() or any(part in excluded for part in relative.parts):
            continue
        if path.suffix == '.zip' or path.name == '.DS_Store' or path.name.startswith('.env'):
            continue
        archive.write(path, Path('UUE_v0.1') / relative)
print('Created UUE_v0.1_Source.zip')
