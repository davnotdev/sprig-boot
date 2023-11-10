import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  base: "https://davnotdev.github.io/sprig-boot/",
  plugins: [solid()],
});
