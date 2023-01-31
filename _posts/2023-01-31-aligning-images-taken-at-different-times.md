---
layout: default
title: "Drone image alignment with Hugin"
description: "Aligning images taken at different times"
---

I have programmed repeatable drone flights using [Litchi](https://flylitchi.com/) so that i can take progress photos of the Copenhagen Lightrail.

The alignment is good ... but it's not perfect.

## June 2022
![Sundvestvej, June 2022](/assets/images/hugin/sundvestvej-jun-2022.jpg)

## January 2023
![Sundvestvej, January 2023](/assets/images/hugin/sundvestvej-jan-2023.jpg)

If we try to overlay these with a slider, we can see that the images aren't perfectly algined. We can do better!

## Comparison
{% include juxtapose.html uid="326232c4-a157-11ed-b5bd-6595d9b17862" %}

## Try using AI

My first instinct was to turn to AI. I tried Python's cv2 library and various combinations of algorithms to auto-detect features, match and skew the photos so that they match. The results were not good. It seems the photos are not similar enough for AI to be able to find the common points.

Most of the time i was getting Star Wars Hyperspace pictures like this:

![Star Wars Hyperspace](/assets/images/hugin/ai-attempt1.jpg)

Sometimes it seemed to match the curve of the bank but flip it round the wrong way:

![Inverted image](/assets/images/hugin/ai-attempt2.jpg)

## Hugin

What i needed was a way of choosing the match points myself. I remembered [Hugin](https://hugin.sourceforge.io/), an open-source photo tool i used to use to stitch panoramas together. That had a way of matching common elements between photos. What if that could be used for layering similar photos taken at a different time?

I installed Hugin and loaded the images.

![Images loaded into Hugin](/assets/images/hugin/images-in-hugin.png)

Initially it seemed to want to treat them as a panorama, side by side. I pressed the "Align" button and it told me it couldn't find any common points, so i would have to find them myself. Perfect!

So i went about finding common features in both photos.

![Finding common features](/assets/images/hugin/finding-common-features.png)

I chose corners and areas of high contrast. I ended up with 20 points, spread across as much of the two photos as i could match.

![20 common points chosen](/assets/images/hugin/common-points-chosen.png)

This time, when i pressed "Align" it managed to align them pretty nicely! All i had to do was choose a good crop that worked for both photos and export them.

![Cropping aligned pictures](/assets/images/hugin/cropping-pictures.png)

## Finished comparison

Now the images are much better algined, so a slider comparison works really well.

{% include juxtapose.html uid="a3491152-a165-11ed-b5bd-6595d9b17862" %}

As we get closer to the completion of Copenhagen Lightrail i'll be making more of these comparison photos, so i'm glad to have found a way to align the images!

See more about Copenhagen Lightrail at [dinletbane.dk](https://www.dinletbane.dk/en/).
