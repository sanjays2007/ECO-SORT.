{ pkgs }:

let
  pythonEnv = pkgs.python311.withPackages (ps: with ps; [
    pip
    uvicorn
    fastapi
    opencv-python
    ultralytics
  ]);
in
{
  channel = "stable-24.11";

  packages = [
    # Python environment (FastAPI + YOLO)
    pythonEnv

    # Node.js for web preview (Vite / Next.js / React)
    pkgs.nodejs_20

    # System libraries required by OpenCV & GUI deps
    pkgs.xorg.libxcb
    pkgs.xorg.libX11
    pkgs.xorg.libXrandr
    pkgs.xorg.libXcursor
    pkgs.xorg.libXinerama
    pkgs.xorg.libXi

    pkgs.glib
    pkgs.zlib
    pkgs.openssl
  ];

  env = {};

  # Firebase emulators
  services.firebase.emulators = {
    detect = false;
    projectId = "demo-app";
    services = [ "auth" "firestore" ];
  };

  idx = {
    extensions = [];

    workspace = {
      onCreate.default.openFiles = [
        "src/app/page.tsx"
      ];
    };

    previews = {
      enable = true;

      previews = {
        web = {
          id = "web";
          manager = "web";
          command = "npm run dev -- --port $PORT --hostname 0.0.0.0";
        };
      };
    };
  };
}
