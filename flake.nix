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
          in
          {
            devShells = {
              default =
                let
                  buildInputs = (
                    with pkgs;
                    [
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
                    ]
                  );
                in
                pkgs.mkShell {
                  PFPATH = "${
                    pkgs.buildEnv {
                      name = "zsh-comp";
                      paths = config.devShells.default.nativeBuildInputs;
                      pathsToLink = [ "/share/zsh" ];
                    }
                  }/share/zsh/site-functions";
                  inherit buildInputs;
                  LD_LIBRARY_PATH = "${pkgs.lib.makeLibraryPath buildInputs}";
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
            pre-commit = {
              check = {
                enable = true;
              };
              settings = {
                src = ./.;
                hooks = {
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
