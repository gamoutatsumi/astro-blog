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
    mcp-servers-nix = {
      url = "github:natsukium/mcp-servers-nix";
      inputs = {
        nixpkgs = {
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
      flake-parts,
      systems,
      ...
    }@inputs:
    flake-parts.lib.mkFlake { inherit inputs; } (
      {
        inputs,
        ...
      }:
      {
        systems = import systems;
        imports = [
          inputs.pre-commit-hooks.flakeModule
          inputs.treefmt-nix.flakeModule
          inputs.mcp-servers-nix.flakeModule
        ];

        perSystem =
          {
            pkgs,
            config,
            system,
            ...
          }:
          let
            treefmtBuild = config.treefmt.build;
            nodejs = pkgs.nodejs_24;
            inherit (pkgs) importNpmLock;
            nodeModules = importNpmLock.buildNodeModules {
              inherit nodejs;
              npmRoot = ./.;
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
            _module = {
              args = {
                pkgs = import inputs.nixpkgs {
                  inherit system;
                  config = {
                    allowUnfree = true;
                  };
                };
              };
            };
            mcp-servers = {
              settings = {
                servers = {
                  astro = {
                    url = "http://localhost:4321/__mcp/sse";
                    type = "sse";
                  };
                };
              };
              programs = {
                playwright = {
                  enable = true;
                };
              };
              flavors = {
                claude-code = {
                  enable = true;
                };
              };
            };
            packages = {
              default = pkgs.buildNpmPackage {
                inherit nodejs;
                npmDeps = importNpmLock {
                  npmRoot = ./.;
                };
                src = ./.;
                installPhase = ''
                  runHook preInstall
                  mkdir -p $out
                  cp -r dist/* $out/
                  runHook postInstall
                '';
                pname = "tatsumi-gamou-blog";
                version = "0.1.0";
                npmConfigHook = importNpmLock.npmConfigHook;
                npmInstallFlags = [
                  "--package-lock-only=false"
                  "--legacy-peer-deps"
                ];
              };
            };
            devShells = {
              default = pkgs.mkShell {
                npmDeps = nodeModules;
                PFPATH = "${
                  pkgs.buildEnv {
                    name = "zsh-comp";
                    paths = config.devShells.default.nativeBuildInputs;
                    pathsToLink = [ "/share/zsh" ];
                  }
                }/share/zsh/site-functions";
                inputsFrom = [
                  treefmtBuild.devShell
                  config.mcp-servers.devShell
                ];
                shellHook = ''
                  ${config.pre-commit.installationScript}
                  source ${importNpmLock.hooks.linkNodeModulesHook}/nix-support/setup-hook
                  linkNodeModulesHook
                '';
                packages =
                  (with pkgs; [
                    # keep-sorted start
                    astro-language-server
                    efm-langserver
                    eslint_d
                    go-task
                    nil
                    prettierd
                    vtsls
                    # keep-sorted end
                  ])
                  ++ [ nodejs ];
              };
            };
            pre-commit = {
              check = {
                enable = true;
              };
              settings = {
                package = pkgs.prek;
                src = ./.;
                hooks = {
                  textlint = {
                    enable = true;
                    entry = "${nodeModules}/node_modules/.bin/textlint";
                    files = "\\.md$";
                  };
                  astro = {
                    enable = true;
                    entry = "${nodeModules}/node_modules/.bin/astro check";
                    files = "\\.(astro|ts)$";
                  };
                  eslint = {
                    enable = true;
                    settings = {
                      binPath = "${nodeModules}/node_modules/.bin/eslint";
                      extensions = "\\.(js|ts|astro)$";
                    };
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
              settings = {
                formatter = {
                  prettier = {
                    command = "${nodeModules}/node_modules/.bin/prettier";
                    options = [ "--write" ];
                    includes = [
                      "*.md"
                      "*.ts"
                      "*.js"
                      "*.astro"
                      "*.json"
                    ];
                  };
                };
              };
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
