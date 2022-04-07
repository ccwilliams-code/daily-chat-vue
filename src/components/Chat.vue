
<template>
  <div id="talkjs-container" style="width: 40%; margin: 30px; height: 500px">
    <i>Loading chat...</i>
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
    Talk.ready.then(function () {
      var me = new Talk.User({
        id: "1111",
        name: "Char",
        email: "ccwill",
        photoUrl: "None",
        welcomeMessage: "Hey there! How are you? :-)",
        role: "default",
      });
      window.talkSession = new Talk.Session({
        appId: "tcLy3HjN",
        me: me,
      });
      var other = new Talk.User({
        id: "654321",
        name: "Sebastian",
        email: "Sebastian@example.com",
        photoUrl: "https://demo.talkjs.com/img/sebastian.jpg",
        welcomeMessage: "Hey, how can I help?",
        role: "default",
      });

      var conversation = window.talkSession.getOrCreateConversation(
        Talk.oneOnOneId(me, other)
      );
      conversation.setParticipant(me);
      conversation.setParticipant(other);

      var inbox = window.talkSession.createInbox();
      inbox.select(conversation);
      inbox.mount(document.getElementById("talkjs-container"));
    });
  },
};
</script>