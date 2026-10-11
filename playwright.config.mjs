import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
 testDir: './tests/browser', fullyParallel: true, workers: 2, reporter: [['list']],
 webServer: [
  {command:'npm run preview --workspace examples/react-vite -- --port 4173',url:'http://127.0.0.1:4173',reuseExistingServer:false},
  {command:'npm run start --workspace examples/nextjs -- --port 4174',url:'http://127.0.0.1:4174',reuseExistingServer:false}
 ],
 projects:[
  {name:'chromium-mobile',use:{...devices['Pixel 7']}},
  {name:'webkit-mobile',use:{...devices['iPhone 13']}}
 ]
});
