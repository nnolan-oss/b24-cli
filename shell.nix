# Development shell for bitrix24-cli
# Usage: nix-shell
{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs_22
    nodePackages.npm
    nodePackages.typescript
  ];

  shellHook = ''
    echo ""
    echo "  bitrix24-cli dev shell"
    echo "  ─────────────────────────"
    echo "  npm install     — install dependencies"
    echo "  npm run build   — build TypeScript"
    echo "  npm run dev     — watch mode"
    echo "  npm link        — link globally (b24)"
    echo ""
  '';
}
