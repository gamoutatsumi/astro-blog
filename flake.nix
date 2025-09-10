{
  description = "Tatsumi GAMOU's Blog";

  inputs = {
    # keep-sorted start block=yes
    flake-parts = {
      url = "github:hercules-ci/flake-parts";
      inputs = {
        nixpkgs-lib = {
          follows = "nixpkgs";
        };
      };
    };
    nixpkgs = {
      url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    };
    pre-commit-hooks = {
      url = "github:cachix/git-hooks.nix";
      inputs = {
        nixpkgs = {
          follows = "nixpkgs";
        };
      };
    };
    systems = {
      url = "github:nix-systems/default";
    };
    treefmt-nix = {
      url = "github:numtide/treefmt-nix";
      inputs = {
        nixpkgs = {
          follows = "nixpkgs";
        };
      };
    };
    # keep-sorted end
  };

  outputs =
    {
      self,
      flake-parts,
      systems,
      ...
    }@inputs:
    flake-parts.lib.mkFlake { inherit inputs; } (
      {
        inputs,
        lib,
        withSystem,
        ...
      }:
      {
        systems = import systems;
        imports = [
          inputs.pre-commit-hooks.flakeModule
          inputs.treefmt-nix.flakeModule
        ];

        perSystem =
          {
            system,
            pkgs,
            config,
            ...
          }:
          let
            treefmtBuild = config.treefmt.build;
            nodejs = pkgs.nodejs_24;
            inherit (pkgs) importNpmLock;
            npmDeps = importNpmLock.buildNodeModules {
              inherit nodejs;
              npmRoot = ./node-pkgs;
              derivationArgs = {
                nativeBuildInputs = with pkgs; [
                  # keep-sorted start
                  cairo
                  giflib
                  libjpeg
                  libpng
                  librsvg
                  pango
                  pixman
                  pkg-config
                  # keep-sorted end
                ];
              };
            };
          in
          {
            devShells = {
              default = pkgs.mkShell {
                inherit npmDeps;
                PFPATH = "${
                  pkgs.buildEnv {
                    name = "zsh-comp";
                    paths = config.devShells.default.nativeBuildInputs;
                    pathsToLink = [ "/share/zsh" ];
                  }
                }/share/zsh/site-functions";
                inputsFrom = [
                  treefmtBuild.devShell
                ];
                shellHook = ''
                  ${config.pre-commit.installationScript}
                  source ${importNpmLock.hooks.linkNodeModulesHook}/nix-support/setup-hook
                  linkNodeModulesHook
                '';
                packages = with pkgs; [
                  # keep-sorted start
                  astro-language-server
                  efm-langserver
                  go-task
                  nil
                  nixfmt-rfc-style
                  nodePackages.npm
                  vtsls
                  # keep-sorted end
                ];
              };
            };
            pre-commit = {
              check = {
                enable = true;
              };
              settings = {
                src = ./.;
                hooks = {
                  astro = {
                    enable = true;
                    entry = "${npmDeps}/node_modules/.bin/astro check";
                    files = "\\.(astro|ts)$";
                  };
                  tsc = {
                    enable = true;
                    entry = "bash -c '${npmDeps}/node_modules/.bin/tsc --noEmit'";
                    files = "\\.ts$";
                  };
                  biome = {
                    enable = true;
                    types_or = [
                      # keep-sorted start
                      "astro"
                      "javascript"
                      "json"
                      "jsx"
                      "markdown"
                      "ts"
                      "tsx"
                      "xml"
                      # keep-sorted end
                    ];
                  };
                  treefmt = {
                    enable = true;
                    packageOverrides = {
                      treefmt = treefmtBuild.wrapper;
                    };
                  };
                };
              };
            };
            formatter = treefmtBuild.wrapper;
            treefmt = {
              projectRootFile = "flake.nix";
              flakeCheck = false;
              programs = {
                # keep-sorted start block=yes
                biome = {
                  enable = true;
                };
                keep-sorted = {
                  enable = true;
                };
                nixfmt = {
                  enable = true;
                };
                shfmt = {
                  enable = true;
                };
                # keep-sorted end
              };
            };
          };
      }
    );
}
