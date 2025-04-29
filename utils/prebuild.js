Promise.resolve()
  .then(() => {
    console.log("getUpdateIni");
    return getUpdateIni();
  })
  .then((update) => {
    console.log("parseUpdateIni");
    return parseUpdateIni(update);
  })
  .then((update) => {
    console.log("downloadFiles");
    return downloadFiles(update);
  })
  .then((files) => {
    console.log("unpackFiles");
    return unpackFiles(files);
  })
  .then((files) => {
    console.log("renameFiles");
    return renameFiles(files);
  })
  .then((files) => {
    console.log("openWinMerge");
    return openWinMerge(files);
  })
  .then((files) => {
    console.log("convertJson");
    return convertJson(files);
  })
  .then((files) => {
    console.log("updateDotenv");
    return updateDotenv(files);
  })
  .then((result) => {
    console.log(result);
    process.exit(0);
  })
  .catch((e) => {
    console.log("Error!", e);
  });

function getUpdateIni() {
  if (process.env.TEST_MODE === "true") return _getUpdateIni();
  return new Promise((resolve, reject) => {
    const http = require("http");
    const req = http.request(process.env.UPDATE_URL + "/update.ini", (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        return resolve(data);
      });
    });
    req.on("error", (e) => {
      console.error(`problem with request: ${e.message}`);
      reject(e);
    });
    req.end();
  });
}

function parseUpdateIni(update_string) {
  return new Promise((resolve, reject) => {
    let update = update_string
      .split("[rebuildpak]\r\npak = agbmp\r\n\r\n")[1]
      .split("\r\n[version]\r\n")
      .map((version) => {
        let files = version.match(/file = (.*)\r\n/g);
        if (!files) files = [];
        return {
          version: version.match(/ver = (\d\.\d\.\d\.\d)/)[1],
          files: files.map((file) => {
            const f = file.split(", ");
            return {
              name: f[0].slice(7),
              save: f[1],
              path: f[2],
              size: f[3].slice(0, -2),
            };
          }),
        };
      });
    resolve(update);
  });
}

function downloadFiles(update) {
  const { execSync } = require("child_process");
  return new Promise((resolve, reject) => {
    const files = update
      .filter((u) => u.version > process.env.LATEST_VERSION)
      .map((u) => u.files)
      .flat()
      .filter(
        (file) =>
          file.path.indexOf("setting") !== -1 && file.name.indexOf("xml") !== -1
      );
    console.log("files", files);
    if (process.env.TEST_MODE === "true") return resolve(files);
    files.forEach((file, i) => {
      const result = execSync(
        `wget -N ${process.env.UPDATE_URL}/${file.path}/${file.name}.pak`,
        { cwd: "utils/download" }
      );
    });
    const result = execSync(`wget -N ${process.env.UPDATE_URL}/update.ini`, {
      cwd: "utils/download",
    });
    return resolve(files);
  });
}

function unpackFiles(files) {
  return new Promise((resolve, reject) => {
    const { execSync } = require("child_process");
    files.forEach((file, i) => {
      try {
        const result = execSync(
          `cmd.exe /c unpacker.exe ../download/${file.name}.pak`,
          { cwd: "utils/unpacker" }
        );
      } catch (e) {
        //console.log('e', e);
      }
    });
    resolve(files);
  });
}

function renameFiles(files) {
  return new Promise((resolve, reject) => {
    const { execSync } = require("child_process");
    files.forEach((file, i) => {
      const source = `unpacker/${file.path.toUpperCase()}/${file.name
        .slice(7)
        .toUpperCase()}`;
      const destination = `files/${file.name}`;
      const result = execSync(`mv ${source} ${destination}`, { cwd: "utils" });
    });
    const result = execSync(`rm -rf SETTING`, { cwd: "utils/unpacker" });
    resolve(files);
  });
}

function openWinMerge(files) {
  return new Promise((resolve, reject) => {
    const fs = require("fs");
    const { exec } = require("child_process");
    const _files = fs.readdirSync("utils/files");
    files.forEach((file, i) => {
      const match = _files
        .filter(
          (f) => f.slice(7).toUpperCase() === file.name.slice(7).toUpperCase()
        )
        .reverse();
      if (match.length < 3) return;
      console.log(
        `\"${process.env.WIN_MERGE_PATH}\" ${match[1]} ${match[0]} -minimize -wl -wr`
      );
      //const result = exec(`cmd.exe /c \"${process.env.WIN_MERGE_PATH}\" ${match[1]} ${match[0]} -s &`, {cwd: 'utils/files'});
    });
    return resolve(files);
  });
}

function convertJson(files) {
  return new Promise((resolve, reject) => {
    const fs = require("fs");
    const parseString = require("xml2js").parseString;
    [
      "item",
      "drop",
      "monster",
      "magic",
      "quest",
      "quest_stepinfo",
      "quest_steplist",
      "pet",
      "petattrib",
      "serv_drop",
    ].forEach((name) => {
      const file = files.find((f) => f.name.indexOf(name + ".xml") !== -1);
      if (!file) return;
      const text = fs.readFileSync("utils/files/" + file.name, "utf8");
      parseString(text, function (err, result) {
        for (let key in result.root) {
          result.root[key] = result.root[key].map((r) =>
            r["$"] ? r["$"] : ""
          );
        }
        fs.writeFileSync(
          `./src/assets/json/${name}.json`,
          JSON.stringify(result, null, "  ")
        );
      });
    });
    resolve(files);
  });
}

function updateDotenv(files) {
  return new Promise((resolve, reject) => {
    if (process.env.TEST_MODE === "true") return resolve();
    if (!files.length) return resolve("update not found!");
    const updateDotenv = require("update-dotenv");
    const version = files.map((file) => file.name.slice(0, 7)).reverse()[0];
    updateDotenv({
      LATEST_VERSION: version.replace(/-/g, "."),
    }).then((newEnv) => resolve("success!!!"));
  });
}

// 以下テスト用

function _getUpdateIni() {
  return new Promise((resolve, reject) => {
    const fs = require("fs");
    fs.readFile("utils/files/update.ini", "utf-8", (e, data) => {
      if (e) reject(e);
      resolve(data);
    });
  });
}
