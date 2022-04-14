<template>
  <main class="wrapper">
    <div class="home" v-if="status === 'home'">
      <h2>Daily Prebuilt demo</h2>
      <p>Start demo with a new unique room or paste in your own room URL</p>
      <div class="start-call-container">
        <button @click="createAndJoinRoom" :disabled="runningLocally">
          Create room and start
        </button>
        <p v-if="roomError" class="error">Room could not be created</p>
        <p class="subtext">or</p>
        <form @submit="submitJoinRoom">
          <label for="room">Daily Room URL</label>
          <input
            id="room"
            type="text"
            placeholder="Enter room URL..."
            v-model="roomUrl"
            pattern="^(https:\/\/)?[\w.-]+(\.(daily\.(co)))+[\/\/]+[\w.-]+$"
            @input="validateInput"
          />
          <input type="submit" value="Join room" :disabled="!validRoomURL" />
        </form>
        <!-- Daily room URL is entered here -->
      </div>
    </div>
    <div class="call-container" :class="{ hidden: status === 'home' }">
      <!-- The Daily Prebuilt iframe is embedded in the div below using the ref -->
      <div id="call" ref="callRef"></div>
      <!-- Only show the control panel if a call is live -->
      <controls
        hidden
        v-if="status === 'call'"
        :roomUrl="roomUrl"
        :callFrame="callFrame"
      />
      <!-- TODO: If I weren't out of time, I would make this something more
      professional, not a plain list 
      Ideally, I'd tie this into the
      participant list built into the Daily call, but I couldn't quite figure
      that out. -->
      <div
        v-if="status === 'call'"
        id="participants-list-div"
        style="width: 100%; margin: 60px; height: 25%; background-color: silver"
      >
        Participant List: Click to chat
        <ul id="participant-list">
          <li v-for="person in local_participants" :key="person.id">
            <a href="#" @click="startChat(person.id, person.name)">
              {{ person.name }}
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="status === 'call'" style="width: 25%; margin: 5px; height: 100%">
      <div id="talkjs-container" style="width: 100%; margin: 30px; height: 75%">
        <i>Loading chat...</i>
      </div>
    </div>
  </main>
</template>

<script>
import DailyIframe from "@daily-co/daily-js";
import Controls from "./Controls.vue";
import api from "../api.js";

import Talk from "talkjs";

var me;
var inbox;

const IFRAME_OPTIONS = {
  height: "auto",
  width: "100%",
  aspectRatio: 16 / 9,
  minWidth: "400px",
  maxWidth: "1600px",
  border: "1px solid var(--grey)",
  borderRadius: "4px",
};

export default {
  components: { Controls },
  name: "Home",
  data() {
    return {
      roomUrl: "",
      status: "home",
      callFrame: null,
      validRoomURL: false,
      roomError: false,
      appState: this.appState,
      local_participants: [],
    };
  },

  computed: {
    runningLocally() {
      return window?.location?.origin.includes("localhost");
    },
  },
  methods: {
    //This function creates or finds a conversation between two people, based on their provided daily ID.
    //This function is run whenever a user clicks on a person's name in the (bottom) participant list.
    startChat(chatID, chatName) {
      var another = new Talk.User({
        id: chatID,
        name: chatName,
        welcomeMessage: "joined the chat.",
      });
      var conversation = window.talkSession.getOrCreateConversation(
        Talk.oneOnOneId(me, another)
      );
      conversation.setParticipant(me);
      conversation.setParticipant(another);
      //This line sets the focus on the conversation with the selected person
      inbox.select(conversation);
    },
    createAndJoinRoom() {
      api
        .createRoom()
        .then((room) => {
          this.roomUrl = room.url;
          this.joinRoom(room.url);
        })
        .catch((e) => {
          console.log(e);
          this.roomError = true;
        });
    },
    // Daily callframe created and joined below
    joinRoom(url) {
      if (this.callFrame) {
        this.callFrame.destroy();
      }

      // Daily event callbacks
      const logEvent = (ev) => console.log(ev);
      const goToLobby = () => (this.status = "lobby");
      const goToCall = () => {
        this.status = "call";
      };
      const leaveMeeting = (ev) => {
        //clean up the local_participants list when a user leaves the call.
        this.local_participants.splice(
          this.local_participants.indexOf(ev.participant.user_id)
        );
      };
      const joinMeeting = (ev) => {
        console.log("A new user has joined the meeting");
        console.log(ev.participant.user_id);
        //A new user has joined the meeting,
        //create a TalkJS user for them and add to the participants list
        var new_participant = new Talk.User({
          id: ev.participant.user_id,
          name: ev.participant.user_name,
          email: "NONE",
          photoUrl: "NONE",
          welcomeMessage: "Hello",
          role: "default",
        });
        //Check if the participant is already in the list - if so, don't add them a second time
        //This would probably only happen with certain refreshing shenanigans
        if (this.local_participants.indexOf(new_participant) == -1)
          this.local_participants.push(new_participant);

        //create the talk session to host the conversations
        Talk.ready.then(function () {
          //create or find a conversation between the local user and the user who joined (based on daily ID)
          var conversation = window.talkSession.getOrCreateConversation(
            Talk.oneOnOneId(me, new_participant)
          );

          conversation.setParticipant(me);
          conversation.setParticipant(new_participant);
        });
      };
      const leaveCall = () => {
        if (this.callFrame) {
          this.status = "home";
          //handle user remove
          //this.$store.state.participants.splice()
          this.callFrame.destroy();
        }
      };
      // DailyIframe container element
      const callWrapper = this.$refs.callRef;

      // Create Daily call
      const callFrame = DailyIframe.createFrame(callWrapper, {
        iframeStyle: IFRAME_OPTIONS,
        showLeaveButton: true,
      });
      this.callFrame = callFrame;

      // Add event listeners and join call
      callFrame
        .on("loaded", logEvent)
        .on("started-camera", logEvent)
        .on("camera-error", logEvent)
        .on("joining-meeting", goToLobby)
        .on("joined-meeting", goToCall)
        .on("left-meeting", leaveCall)
        .on("participant-joined", joinMeeting)
        .on("participant-left", leaveMeeting);

      callFrame.join({ url, showFullscreenButton: true }).then((join_info) => {
        console.log(join_info);
        this.$store.state.local_user.username = join_info.local.user_name;
        this.$store.state.local_user.user_id = join_info.local.user_id;
        me = new Talk.User({
          id: join_info.local.user_id,
          name: join_info.local.user_name,
          welcomeMessage: "Has joined the chat.",
        });
        window.talkSession = new Talk.Session({
          appId: "tcLy3HjN",
          me: me,
        });

        //Create the inbox and mount it to its html container.
        inbox = window.talkSession.createInbox();
        inbox.mount(document.getElementById("talkjs-container"));
      });
    },
    submitJoinRoom(e) {
      e.preventDefault();
      this.joinRoom(this.roomUrl);
    },
    validateInput(e) {
      this.validRoomURL = !!this.roomUrl && e.target.checkValidity();
    },
  },
};
</script>

<style scoped>
.wrapper {
  background-color: darkgrey;
  height: 100%;
  display: flex;
  align-items: center;
}
.home {
  flex: 1;
}
.error {
  color: var(--red-dark);
}
.call-container {
  display: flex;
  max-width: 1200px;
  margin: auto;
  flex: 1;
  flex-wrap: wrap;
}
.call-container.hidden {
  flex: 0;
}
#call {
  flex: 1;
  margin-top: 24px;
}
.start-call-container {
  display: flex;
  flex-direction: column;
  max-width: 200px;
  margin: auto;
}
.start-call-container .subtext {
  margin: 8px 0 0;
}
.start-call-container input {
  margin-top: 8px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--grey);
  padding: 0 16px;
}
.start-call-container button {
  color: var(--dark-blue);
  background: var(--teal);
  border: 1px solid transparent;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 16px;
}
.start-call-container input[type="submit"] {
  color: var(--dark-blue);
  background: var(--teal);
  border: 1px solid transparent;
  padding: 6px 16px 8px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 16px;
}
button:disabled,
.start-call-container input[type="submit"]:disabled {
  cursor: not-allowed;
  background: var(--white);
  border: 1px solid var(--grey);
}
label {
  opacity: 0;
  font-size: 1px;
}
</style>
