{
  description = "b24-cli — manage Bitrix24 from terminal";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = nixpkgs.legacyPackages.${system};

        b24-cli = pkgs.buildNpmPackage rec {
          pname = "b24-cli";
          version = "1.0.0";

          src = ./.;

          npmDepsHash = ""; # TODO: run `prefetch-npm-deps package-lock.json` and paste hash

          nodejs = pkgs.nodejs_22;

          buildPhase = ''
            npm run build
          '';

          installPhase = ''
            mkdir -p $out/lib/node_modules/b24-cli
            cp -r dist package.json node_modules $out/lib/node_modules/b24-cli/

            mkdir -p $out/bin
            ln -s $out/lib/node_modules/b24-cli/dist/cli.js $out/bin/b24-cli
            ln -s $out/lib/node_modules/b24-cli/dist/cli.js $out/bin/b24

            chmod +x $out/bin/b24-cli
            chmod +x $out/bin/b24
          '';

          meta = with pkgs.lib; {
            description = "CLI tool to manage Bitrix24 tasks, comments, time tracking from terminal";
            homepage = "https://github.com/nnolan-oss/b24-cli";
            license = licenses.mit;
            platforms = platforms.all;
            mainProgram = "b24";
          };
        };
      in {
        packages = {
          default = b24-cli;
          b24-cli = b24-cli;
        };

        apps.default = {
          type = "app";
          program = "${b24-cli}/bin/b24";
        };

        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_22
            nodePackages.npm
            nodePackages.typescript
          ];

          shellHook = ''
            echo "b24-cli dev shell"
            echo "  npm install  — install deps"
            echo "  npm run build — build project"
            echo "  npm link — link globally"
          '';
        };
      }
    );
}
