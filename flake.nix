{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };
  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = nixpkgs.legacyPackages.${system};
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [ bun ];
          shellHook = with pkgs; ''
            echo "Entering Bun + React development shell with Nix."
            # Ensure local node_modules are used if they exist
            export PATH=$PWD/node_modules/.bin:$PATH
          '';
        };

      });
}
