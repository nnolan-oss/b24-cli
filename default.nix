# Classic nix-build / nix-env support
# Usage:
#   nix-build
#   nix-env -if .
#   nix-shell
{ pkgs ? import <nixpkgs> {} }:

let
  bitrix24-cli = pkgs.stdenv.mkDerivation rec {
    pname = "bitrix24-cli";
    version = "1.0.0";

    src = ./.;

    buildInputs = [ pkgs.nodejs_22 ];
    nativeBuildInputs = [ pkgs.nodejs_22 pkgs.makeWrapper ];

    buildPhase = ''
      export HOME=$(mktemp -d)
      npm ci --ignore-scripts
      npm run build
    '';

    installPhase = ''
      mkdir -p $out/lib/node_modules/bitrix24-cli
      cp -r dist package.json node_modules $out/lib/node_modules/bitrix24-cli/

      mkdir -p $out/bin

      makeWrapper ${pkgs.nodejs_22}/bin/node $out/bin/bitrix24-cli \
        --add-flags "$out/lib/node_modules/bitrix24-cli/dist/cli.js"

      makeWrapper ${pkgs.nodejs_22}/bin/node $out/bin/b24 \
        --add-flags "$out/lib/node_modules/bitrix24-cli/dist/cli.js"
    '';

    meta = with pkgs.lib; {
      description = "CLI tool to manage Bitrix24 tasks, comments, time tracking from terminal";
      license = licenses.mit;
      platforms = platforms.all;
      mainProgram = "b24";
    };
  };
in
bitrix24-cli
