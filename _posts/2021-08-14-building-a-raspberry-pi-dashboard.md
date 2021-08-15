---
layout: default
title: "Building a Raspberry Pi dashboard"
description: "How to make any television into an awesome cycling dashboard display"
# image: "https://s3-eu-west-1.amazonaws.com/cityringen/comparisons/2018-2019/2018-2019-share.png"
---

# Building a Raspberry Pi dashboard

Imagine you have a spare television or monitor at work or home, not being used for anything, and you want to use it to display some websites in tabs, such as information dashboards. You want it to start in fullscreen mode and automatically loop through the tabs. Ideally you want this to start up just by turning the television on, and you want it to work independently without the need for a keyboard or mouse attached. Anyone should be able to configure which tabs are displayed by updating a document in GitHub.

Grab your Raspberry Pi, because we're about to build a dashboard display!

## You will need

* A spare television
* A Raspberry Pi 4 (other models will work but generation 4 is silent, has built-in WiFi and supports 4K HDMI output)
* A micro-HDMI to HDMI cable
* A USB to USB-C cable to power the Raspberry Pi from USB output on the television
* A keyboard and mouse to set things up initially
* Possibly: A micro-SD card reader to write a new operating system to SD card

Time required: about 20-30 minutes.

## What this tutorial is not

This tutorial assumes you already have some dashboard websites on the internet that you want to display, maybe from Google Analytics, Kibana, Grafana, etc. This tutorial does not cover the creation of such dashboards.

## Start with Raspberry Pi OS

My recommendation is you head to [raspberrypi.org](https://www.raspberrypi.org) and download the latest Raspberry Pi OS imager. If you've just bought a new Raspberry Pi, it's likely it already has an OS installed, so you can skip this step.

Connect your SD card reader to your computer and go through the imaging process to write Raspberry Pi OS (32-bit) to the micro-SD card.

## Initial Raspberry Pi setup

Put the micro-SD card back into your Raspberry Pi. Connect your Raspberry Pi to the television HDMI and USB port, turn on the television, and the Rasbperry Pi should start to boot up. At this point you'll want to use a keyboard and mouse connected to the Raspberry Pi to set up the initial configuration.

Follow the tutorial to set location, set a password, and connect to a WiFi network. Allow the Raspberry Pi to update software. This can take a few minutes. Now reboot.

## Install TabCarousel plugin for Chromium

Go to the Raspberry Pi menu &rarr; Internet &rarr; Chromium Web Browser

Search for ant install TabCarousel plugin

Go to the plugin preferences and set how often you want it to cycle between tabs, and set it to start automatically.

## Advanced Raspberry Pi setup

Go to the Raspberry Pi menu &rarr; Preferences &rarr; Raspberry Pi Configuration

Under System, set a hosthame (I set mine to `piboard`).

Make sure it is set to boot to desktop, and auto login as current user (it might say As user 'pi').

Under Interfaces, enable SSH.

Reboot again.

## Check SSH access

Of course it is possible to follow this entire tutorial with a keyboard and mouse attached directly to the Raspberry Pi, but that's not always the most practical solution. So you can go to another computer connected to the same WiFi network, and ssh in.

    ssh pi@piboard.local

Accept the connection by typing `yes` and type the password that you configured for the Raspberry Pi, and you will be in!

## Disable low voltage warnings

If you see a lightning bolt symbol in the corner of the screen, it's a warning that your television USB output is not supplying the ideal amount of power to the Raspberry Pi. There is a small risk that the Raspberry Pi could start to behave strangely or corrupt the SD card. If this concerns you, get a proper plug adapter and power your Raspberry Pi from a standard power socket.

In my experience the risk is very small, and in the worst case scenario I would just reinstall Raspberry Pi OS and follow this tutorial again. I like the Raspberry Pi being powered by the television because it can be turned on and off just with a TV remote. So I choose to disable the warnings.

If you want to do this, it's time to start editing a file on the Raspberry Pi. From your SSH terminal:

    sudo nano /boot/config.txt

Add the following lines at the end of the file:

    # Disable low voltage warning
    avoid_warnings=1

Save the file and reboot the Raspberry Pi. You can do this from your SSH connection by typing:

    sudo reboot

This will deal with the lighthing bolt symbol. You may find you still see a grey warning box. If this is the case, you can disable this too:

    sudo apt-get -y remove lxplug-ptbatt

This change will take effect after another reboot.

## Install unclutter

Unclutter is a little program to hide the mouse pointer, to prevent it getting in the way when you don't need it. We're going to use this to keep our dashboard lovely and tidy.

    sudo apt-get -y install unclutter

## Create a links file

Add a text file to a public GitHub repo with the links you want to open:

![List of dashboard links](/assets/images/piboard/list-of-dashboard-links.png)

Of course, you could put this file into a private repo if security is a concern, but you would have to work a bit harder with the script that's going to read it to open the tabs.

## Write a script to launch the dashboard

We are going to make a script that reads the list of links and launches them in a fullscreen Chromium.

Create a `dashboard.sh` file:

    sudo nano /home/pi/dashboard.sh

Save this script to the file:

    #!/bin/bash

    # config options
    export ORG=drdk
    export REPO=dashboards
    export BRANCH=main
    export DASHBOARD=teamqa.txt

    # don't let this display sleep
    export DISPLAY=:0.0
    xset s noblank
    xset s off
    xset -dpms

    # hide mouse pointer
    unclutter -idle 0.5 -root &

    # trick Chromium into believing it shut down successfully last time
    sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' /home/pi/.config/chromium/Default/Preferences
    sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/' /home/pi/.config/chromium/Default/Preferences

    # Launch Chromium 
    /usr/bin/chromium-browser \
      --start-fullscreen \
      --no-first-run \
      --noerrdialogs \
      --disable-infobars \
      $(curl -s "https://raw.githubusercontent.com/${ORG}/${REPO}/${BRANCH}/${DASHBOARD}") &

The config options specify where exactly to find the list of links that should be opened when the browser is launched. In my case I'm using organisation `drdk`, a repository called `dashboards`, I want to use the `main` branch, and the filename I want to use is `teamqa.txt`. You should set these to the values that make sense for you.

The second block sets the display to avoid sleeping, while the third block hides the mouse pointer.

The fourth block stops Chromium from complaining about unclean shutdown. Since at any time we might turn off the television, which will suddenly cut power to the Raspberry Pi, it's likely that Chromium would get upset if we don't give it some reassurance.

Lastly, the script launches Chromium with the following options:

* `--start-fullscreen` - makes it fill the whole screen at start up. An alternative mode is `--kiosk` but this will literally prevent anyone from doing anything else on the Raspberry Pi. You choose which you want. I prefer `--start-fullscreen` because it still gives the option to press F11 and come out of fullscreen in case I ever need to do anything else on the Raspberry Pi.
* `--no-first-run` - skips first-run checks (i.e. default browser)
* `--noerrdialogs` - avoids showing any errors that could interfere with your dashboard experience
* `--disable-infobars` - avoids annoying popups about detecting your location etc.

Make this script executable by anyone:

    sudo chmod a+x /home/pi/dashboard.sh

Try it out!

    /home/pi/dashboard.sh

Within a few seconds, your Raspberry Pi should launch Chromium in fullscreen mode, and show the first of your list of links. After a short period, TabCarousel should automatically move it on to the next.

Congratulations! You now have a dashboard display!

## Make it start up automatically

Now we make a service to start the dashboard automatically every time the Raspberry Pi boots up.

Create a `dashboard.service` file:

    sudo nano /etc/systemd/system/dashboard.service

Save this configuration to the file:

    [Unit]
    Description=Dashboard
    After=network.target
    After=systemd-user-sessions.service
    After=network-online.target
    After=graphical.target
    Requires=graphical.target
    Requires=network-online.target

    [Service]
    Environment=DISPLAY=:0.0
    Environment=XAUTHORITY=/home/pi/.Xauthority
    Type=forking
    ExecStartPre=/bin/sh -c 'until ping -c1 raw.githubusercontent.com; do sleep 1; done;'
    ExecStart=/home/pi/dashboard.sh
    Restart=on-abort
    User=pi
    Group=pi

    [Install]
    WantedBy=graphical.target

The script tries to wait for the network to be ready, but sometimes this isn't always successful. The network can be "ready" whilst DNS is still not yet active, for example. This would mean we cannot read the links list from GitHub, so the browser would start with an empty tab. To avoid this, we use `ExecStartPre` to wait until we can get a response back from GitHub. Then we call the dashboard script that we made just now.

Enable the service to run at boot:

    sudo systemctl enable dashboard

That should be it. In theory you can now turn your television off and on again, and your Raspberry Pi will boot up and launch your dashboard display automatically in fullscreen mode, and cycle through the links you wanted.

## Debugging problems

To stop the dashboard service from SSH:

    sudo systemctl stop dashboard

To start the dashboard service from SSH:

    sudo systemctl start dashboard

Check the logs to find any issues with the service:

    sudo journalctl -u dashboard

If you change the service definition you will need to reload it:

    sudo systemctl daemon-reload

## Enable emoji in Chromium

The dashboard I'm using uses emoji for part of its information. By default these are not supported by Chromium on Raspberry Pi OS, but you can easily enable them:

    sudo apt-get -y install fonts-noto-color-emoji
    sudo fc-cache -f -v

## Credits

Thanks to the following sources for a lot of the inspiration that went into this post.

* [Raspberry Pi (4) Kiosk / Wall Display / Dashboard](https://jonathanmh.com/raspberry-pi-4-kiosk-wall-display-dashboard/)
* [Disable Low-voltage warning in Raspberry Pi](https://terminalwiki.com/disable-low-voltage-warning-in-raspberry-pi/)
* [Low voltage warning message text](https://www.raspberrypi.org/forums/viewtopic.php?t=286821)
* [List of Chromium Command Line Switches](https://peter.sh/experiments/chromium-command-line-switches/)
* [How to open a set of tabs together quickly?](https://superuser.com/questions/417205/how-to-open-a-set-of-tabs-together-quickly)
* [Service unit configuration - systemd.service](https://www.freedesktop.org/software/systemd/man/systemd.service.html)
* [Tutorial: Colored emojis in Chromium](https://www.raspberrypi.org/forums/viewtopic.php?t=253484)
