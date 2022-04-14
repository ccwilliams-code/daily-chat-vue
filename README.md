# Daily pre-built + TalkJS

Extended Chat Functionality POC

This demo shows how easily you can extend the Daily pre-built library's chat functionality by importing a third-party chat api.

To use this demo, you will first need to [create a Daily account](https://dashboard.daily.co/signup). You will need your Daily API key, which can be found on the [Developers](https://dashboard.daily.co/developers) page, if you want to create new rooms through the demo UI.

After that is set up, open two incognito browser windows (or grab a friend and share your room link!) and log in as two separate users. After the second user logs in, you'll see a hyperlink appear at the bottom containing a list of participants currently in the call. You can click on their name to start a chat with them! You can then type your messages and send them in a one-on-one chat using the TalkJS Inbox/Chat widget on the right side of your screen.

Additional information on setting up the TalkJS Chat component can be found [here](https://talkjs.com/docs/Getting_Started/). In short, you'll need to sign up for a TalkJS account and get your API key as described there.

## Requirements

To use this demo, you will first need to [create a Daily account](https://dashboard.daily.co/signup). You will need your Daily API key, which can be found on the [Developers](https://dashboard.daily.co/developers) page, if you want to create new rooms through the demo UI.

You can use existing Daily rooms in the demo by pasting the room URL into the input. The room URL should be in this format to be valid: `https://domain-name.daily.co/room-name`, with `daily-domain` changed to your domain, and `room-name` changed to the name of the existing room you would like to use.

---

## Running locally

To run this demo locally:

1. Install dependencies `npm install`
2. Start dev server `npm run serve`
3. Then open your browser and go to http://localhost:8080

OR...

## Related blog posts/tutorials

Lean more about this demo with our [Vue+Daily Prebuilt tutorial](https://www.daily.co/blog/build-a-video-chat-app-with-vue-and-daily-prebuilt/) on the [Daily blog](https://www.daily.co/blog/).

# Additional Artifacts created while designing and building this PoC:

# Requirements Document

1. **HIGH PRIORITY**
   1. Direct Messaging between call members
   2. Allows attachments or images to be sent/received
   3. No 3rd Party login required (i.e. a second password/login step)
   4. Browser-based
2. **MEDIUM PRIORITY**
   1. Low code requirement and easy to setup/customize
   2. Free-tier available
3. LOW PRIORITY
   1. Ability to manage chats/switch between conversations

# Requirements/Features Matrix

| Library Name
Features | TalkJS | Weavy | CometChat | SendBird | Cryptalk | StreamChat | PureChat |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hosting | Hosted | Hosted | Hosted | | Self-Hosted (Docker) | | |
| Free Tier Available? | Y | Y | Y | 30-Day | Y | 30-Day | 30-Day |
| Browser-based Solution | Y | Y | Y | Y | Y | Y | Y |
| Direct Messaging | Y | Y | Y | | | | |
| Login Required? | N | N | Y | | | | |
| Speed/Ease of Implementation | | | | | | | |
| Images | Y | Y | Y | | | | |
| File Attachments | | Y | Y | | | | |
| Polling | Unknown | | Extension | | | | |
| Switching between conversations easily | N | ? | ? | ? | ? | ? | ? |
| Notes | | https://www.weavy.com/ | | | https://github.com/Hexagon/cryptalk
Focus on security | | https://purechat.com/ |

# Work log

# 4/4 1 hour

- researched TalkJS and CometChat, searched for alternatives
- Created requirements vs features matrix

# 4/7 2-3 hours

- Installed daily prebuilt vue demo to use as a basis for poc
- Setup TalkJS, CometChat, Weavy accounts for testing.
  - Determined, in my opinion, TalkJS would be the best fit for this usecase
- Created a quick test integration to show layout and basic features
- Authored email to Jon to verify requirements and get feedback on the layout.

# 4/13 5-6 hours

- Finished coding prototype
- Basic functionality testing
- Created documentation, readme, etc
- uploaded project to git
- Emailed Jon to let him know that I’ve completed work on this project
