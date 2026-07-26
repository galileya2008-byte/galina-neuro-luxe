import { copyFileSync } from "fs";
import { join } from "path";

const indexPath = join("dist", "index.html");
copyFileSync(indexPath, join("dist", "404.html"));
