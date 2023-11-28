# Whatsapp bot connected to AI

" NOTE: I can't guarantee you will not be blocked by using this method, although it has worked for me. WhatsApp does not allow bots or unofficial clients on their platform, so this shouldn't be considered totally safe "



## Used other repositories 

* Whatsapp-web.js

     This is a Whatsapp bot based on [Whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js/#whatsapp-webjs) and implemented to do some advanced work.
     > Credits to [Pedro S Lopez](https://github.com/pedroslopez)

     **So please read all documentation from Whatsapp-web.js first**
     > [Links](https://github.com/pedroslopez/whatsapp-web.js/#quick-links)


* Google-translate-api

     This bot also uses [google-translate-api-x](https://github.com/AidanWelch/google-translate-api)
     > Credits to [AidanWelch](https://github.com/AidanWelch)

* truecallerjs

* googlethis

* async-g-i-s

* ytdl-core

* ultimate-text-to-image

## Features
* All features from [Whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js/#supported-features)
* Translate any language to any language
* Make Whatsapp stickers within chat
* [Openai](https://openai.com/) chat and Image generation
* Truecaller
* Youtube download

## Installation

- Node v12+ is required
- Install Gitbash
- ffmpeg required

1. Create a folder/directory and name it like wabot


2. Open terminal in that folder/directory and run these commands

      `npm init -y`

      `npm i whatsapp-web.js`
      
      `npm i qrcode-terminal`

      `npm i openai`

      `npm i google-translate-api-x`
   
      `npm i ultimate-text-to-image`

      `npm i ytdl-core`

      `npm i async-g-i-s`

      `npm i googlethis`

      `npm i truecallerjs`

      `npm install mime-types`
      
      
     Also if you are running on Linux server you must use following two commands
      
       sudo npm install -g puppeteer --unsafe-perm=true -allow-root && sudo apt install chromium-browser -y
      and
      
       sudo apt update && sudo apt install -y gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget


4. Also to make stickers need ffmpeg. 

    If you are a windows user download it from [here](https://www.gyan.dev/ffmpeg/builds/) and extract ffmpeg.exe to folder that created (wabot)
    
    If you are a linux user run this command 
    
       sudo apt install ffmpeg
    

5. Then download [index.js](https://github.com/ravishkaw/whatsappgpt/blob/main/index.js) and move it to folder/directory


6. To use openai features you have to get api key. You can get api key from [here](https://beta.openai.com/account/api-keys). Then add your api key to system as a environment variable to OPENAI_API_KEY . In linux just paste api key in code in relevant places.




## Run

After following all installation guides change [index.js](https://github.com/ravishkaw/whatsappgpt/blob/main/index.js) as your need. Also refer [Guides](https://wwebjs.dev/guide/) and [Documentation](https://docs.wwebjs.dev/) from whatsapp-web.js.

Then run node index.js in terminal. Scan qr and link your device.

And that's all. Use your whatsapp bot
