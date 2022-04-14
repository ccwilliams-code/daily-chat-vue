
<template>
  <div style="width: 25%; margin: 30px; height: 85%">
    <div id="talkjs-container" style="width: 100%; margin: 30px; height: 100%">
      <i>Loading chat...</i>
    </div>
  </div>
</template>

<script>
import Talk from "talkjs";
export default {
  name: "Inbox",
  props: {
    currentUser: {
      type: Object,
      required: true,
    },
  },
  mounted: function () {
    //var me2 = this.$store.state;
    //var participants = this.$store.state.participants;

    Talk.ready.then(function () {
      // TODO: Fake Data, replace with data from objects
      var me = new Talk.User({
        id: "1234",
        name: "charchar",
        welcomeMessage: "Has joined the chat.",
      });
      console.log("Chat user:");
      console.log(me);
      window.talkSession = new Talk.Session({
        appId: "tcLy3HjN",
        me: me,
      });
      //console.log(me2);

      //for each participant in the room, create an empty conversation
      //   for (var each in participants) {
      //     console.log("IN the loop" + each);
      //     var x = new Talk.User(participants[each]);
      //     console.log(x);
      //   }
      var other = new Talk.User({
        id: "654321",
        name: "Sebastian",
        welcomeMessage: "Has joined the chat.",
      });

      var conversation = window.talkSession.getOrCreateConversation(
        Talk.oneOnOneId(me, other)
      );
      conversation.setParticipant(me);
      conversation.setParticipant(other);

      var inbox = window.talkSession.createInbox();
      //inbox.select(conversation);
      inbox.mount(document.getElementById("talkjs-container"));
    });
  },
};
</script>