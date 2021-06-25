# Cirun.io Documentation

## Installation

```
pip install -r requirements.txt
```

## Build Documentation

```bas
cd docsrc
make html
```

To build and preview docs:

```bash
cd docsrc && make html && open _build/html/index.html && cd ..
```

## Update `docs/`

```bash
cp -r docsrc/_build/html/* docs/
```

and now commit and push

TODO: Automated this via GitHub Actions
