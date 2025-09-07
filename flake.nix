{
  description = "Tatsumi GAMOU's Blog";

  inputs = {
    # keep-sorted start block=yes
    flake-compat = {
      url = "github:edolstra/flake-compat";
    };
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
        flake-compat = {
          follows = "flake-compat";
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
        imports =
          [ ]
          ++ lib.optionals (inputs.pre-commit-hooks ? flakeModule) [ inputs.pre-commit-hooks.flakeModule ]
          ++ lib.optionals (inputs.treefmt-nix ? flakeModule) [ inputs.treefmt-nix.flakeModule ];

        perSystem =
          {
            system,
            pkgs,
            config,
            ...
          }:
          let
            treefmtBuild = config.treefmt.build;
          in
          {
            devShells = {
              default =
                let
                  buildInputs = (
                    with pkgs;
                    [
                      cairo
                      pkg-config
                      libjpeg
                      pango
                      libpng
                      giflib
                      librsvg
                      pixman
                    ]
                  );
                in
                pkgs.mkShell {
                  buildInputs =
                    buildInputs
                    ++ (lib.optionals (pkgs.stdenv.isDarwin) (with pkgs; [ darwin.apple_sdk.frameworks.CoreText ]));
                  LD_LIBRARY_PATH =
                    "${pkgs.lib.makeLibraryPath buildInputs}"
                    + lib.optionalString pkgs.stdenv.isDarwin ":${pkgs.darwin.apple_sdk.frameworks.CoreText}/LIbrary/Frameworks";
                  packages = (
                    with pkgs;
                    [
                      # keep-sorted start
                      astro-language-server
                      bun
                      efm-langserver
                      nil
                      nixfmt-rfc-style
                      vtsls
                      # keep-sorted end
                    ]
                  );
                  inputsFrom = [
                    config.pre-commit.devShell
                    treefmtBuild.devShell
                  ];
                };
            };
          }
          // lib.optionalAttrs (inputs.pre-commit-hooks ? flakeModule) {
            pre-commit = {
              check = {
                enable = true;
              };
              settings = {
                src = ./.;
                hooks = {
                  biome = {
                    enable = true;
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
          }
          // lib.optionalAttrs (inputs.treefmt-nix ? flakeModule) {
            formatter = treefmtBuild.wrapper;
            treefmt = {
              projectRootFile = "flake.nix";
              flakeCheck = false;
              settings = {
                formatter = {
                  biome = {
                    includes = [
                      "*.astro"
                      "*.xml"
                    ];
                  };
                };
              };
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
                pinact = {
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
