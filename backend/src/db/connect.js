import fs from "fs";
const DB_FILE = "./src/db/data.json";

export function readData() {
  if (!fs.existsSync(DB_FILE)) return [];
  const data = fs.readFileSync(DB_FILE, "utf-8");
  return JSON.parse(data || "[]");
}

export function writeData(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}
