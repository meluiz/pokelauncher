const builder = require("electron-builder");
const { preductname } = require("./package.json");

builder
  .build({
    config: {
      generateUpdatesFilesForAllChannels: false,
      appId: preductname,
      productName: preductname,
      artifactName: "${productName}-${os}-${arch}.${ext}",
      files: ["src/**/*", "package.json", "LICENSE.md"],
      directories: { output: "dist" },
      compression: "maximum",
      asar: true,
      publish: [
        {
          provider: "github",
          releaseType: "release"
        }
      ],
      win: {
        icon: "./resources/icon.ico",
        target: [
          {
            target: "nsis",
            arch: ["x64"]
          }
        ]
      },
      nsis: {
        oneClick: true,
        allowToChangeInstallationDirectory: false,
        createDesktopShortcut: true,
        runAfterFinish: true
      },
      mac: {
        icon: "./resources/icon.ico",
        category: "public.app-category.games",
        target: [
          {
            target: "dmg",
            arch: ["x64", "arm64"]
          }
        ]
      },
      linux: {
        icon: "./resources/icon.png",
        target: [
          {
            target: "AppImage",
            arch: ["x64"]
          },
          {
            target: "tar.gz",
            arch: ["x64"]
          }
        ]
      }
    }
  })
  .then(() => {
    console.log("The build is finished");
  })
  .catch(err => {
    console.error("Error during build!", err);
  });
