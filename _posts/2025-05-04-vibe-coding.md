---
layout: default
title: An experiment in vibe coding
description: I had a go at vibe coding a little app. Here are my thoughts.
image: https://www.aimeerivers.com/assets/images/vibe-coding/og-image.png
---

<img src="/assets/images/vibe-coding/music-quiz-app.png" style="float: right; margin: 0 0 1em 1em; width: 40%; max-width: 300px;">

A few days ago, i was preparing for a music quiz and realized i needed a small app to play short clips of music.

Since it was a simple, one-off tool that wouldn't require ongoing maintenance, i decided it was the perfect candidate for vibe coding.

I used GitHub Copilot to write HTML, CSS, and JavaScript for me. i barely looked at the code it generated — i just tested the output and gave feedback.

## The Finished App

You can try out the finished app here: [www.aimeerivers.com/music-quiz](https://www.aimeerivers.com/music-quiz/)

The source code is available on GitHub: [github.com/aimeerivers/music-quiz](https://github.com/aimeerivers/music-quiz)

## How We Got There

Here's how i began the session:

> let's vibe code a new project!
>
> i want to make a music quiz website.
>
> it will have four rounds and a tie-breaker question.
>
> each round will play up to 10 short clips of music.
>
> i only want to use html, javascript and css. that is to say, it'll be a static site that can be hosted on GitHub pages.
>
> the rounds are as follows:
>
> - Round 1: Name that song (10 clips)
> - Round 2: Finish the lyric (5 songs, 2 clips each)
> - Round 3: Guess the theme (5 clips)
> - Round 4: Throwback party (5 clips)
> - Tie-breaker (1 clip)
>
> i will provide the clips, but you can name them whatever makes sense and i'll drop the clips in.
>
> i'd like the site to have nice big play/pause buttons so it's clear for the quizmaster to know where they have to press.
>
> you can link the rounds together in different pages or a single page app, whatever you think is best.

If you're interested, you can read the full set of prompts used here: [PROMPT.md](https://github.com/aimeerivers/music-quiz/blob/main/PROMPT.md)

## Problems Along the Way

While i was generally happy with the design (i gave no direction on style), Copilot struggled with spatial terms like _"next to"_ or _"underneath"_. It didn't seem to have a clear concept of layout, so positioning elements took a few tries.

Similarly, when i asked for more padding between buttons, it added top padding instead of left. To me it seemed obvious what i meant — since i was describing buttons that to me appeared side-by-side — but Copilot wasn't _seeing_ the layout in the same way, so i needed to be more explicit.

Later, when we needed to refactor how element IDs were assigned, that went pretty badly. Copilot began rewriting entire pages and adding the wrong number of play buttons. I had to step in and manually fix that part.

## Benefits of Vibe Coding

This experiment was _perfect_ for a quick, disposable tool. It was definitely faster than writing the code myself.

I would have needed to remind myself how `<audio>` elements work, and how JavaScript event listeners interact with them. Instead, Copilot generated code that looked familiar enough that it was worth going straight into testing.

There was also a lot of repetitive, fiddly work — like placing ten clips on a page and giving them the correct IDs and linking them to the correct files. That is something that Copilot was able to do much better than i could.

## Conclusions

i really enjoyed the experiment! It was freeing not to have to deeply understand the code. My only concerns were: _Does it work?_ and _Does it look okay?_ The rest was out of scope.

Would i use this approach again? Absolutely — for small, one-off tools or prototypes. But for anything that requires long-term maintenance, i don't think Copilot is quite there yet. Maybe other tools that are more intended for vibe coding an entire project could give better results.

I'm increasingly glad that i learned to code _"the old-fashioned way"_. It gives me the insight to spot problems in AI-generated code and step in when needed. I worry that newer developers might rely too much on tools like Copilot without building a deep understanding of how the code really works. Time will tell whether or not that turns out to be a problem.

As an experienced developer, i feel now more than ever the sense of responsibility to help train the next generation whilst also keeping up with the emerging tools myself.
