require("dotenv").config();
const { google } = require('googleapis');
const Tutor = require('../models/tutorModel');
const axios = require("axios");

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

async function getAccessToken() {
  const { token } = await oauth2Client.getAccessToken();
  return token;
}

async function createGoogleMeetAndSendEmail(userEmail, dateTime) {
  const accessToken = await getAccessToken();
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const startDateTime = dateTime;
  const endDateTime = new Date(new Date(dateTime).getTime() + 60 * 60 * 1000).toISOString();

  const event = {
    summary: "Trial Session Scheduled",
    description: "Trial session scheduled successfully",
    start: { dateTime: startDateTime, timeZone: "UTC" },
    end: { dateTime: endDateTime, timeZone: "UTC" },
    attendees: [{ email: userEmail }],
    conferenceData: {
      createRequest: {
        requestId: "req-" + new Date().getTime(),
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 1440 }, // 24 hours before
        { method: "email", minutes: 180 }, // 3 hours before
        { method: "email", minutes: 10 },  // 10 minutes before
      ],
    },
  };

  try {
    // Create the Google Calendar event
    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: "all",
    });

    const meetLink = response.data.conferenceData.entryPoints[0].uri;
    const eventId = response.data.id;

    return { meetLink, eventId };
  } catch (error) {
    console.error("Error creating Google Meet event:", error);
  }
}


async function createGoogleMeetLink(dateTime) {
  const startDateTime = dateTime;
  const endDateTime = new Date(new Date(dateTime).getTime() + 60 * 60 * 1000).toISOString();

  const event = {
    summary: 'Scheduled Google Meet',
    description: 'Google Meet created automatically.',
    start: { dateTime: startDateTime, timeZone: 'UTC' },
    end: { dateTime: endDateTime, timeZone: 'UTC' },
    conferenceData: {
      createRequest: {
        requestId: 'req-' + new Date().getTime(),
        conferenceSolutionKey: { type: 'hangoutsMeet' }
      }
    }
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    resource: event,
    conferenceDataVersion: 1
  });
  return {meetLink: response.data.conferenceData.entryPoints[0].uri, eventId : response.data.id};
}

//function for deleting google meet link
async function deleteGoogleMeet(eventId) {
    try {
      await calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId
      });
      return { message: 'Event deleted successfully' };
    } catch (error) {
      throw new Error('Failed to delete event: ' + error.message);
    }
  }

  const ACCESS_TOKEN = "542066278367400"; // Get from Meta Developers
  const PHONE_NUMBER_ID = "594839707044250"; // Get from WhatsApp Business API settings
  const RECIPIENT_NUMBER = "+918489140739"; // Include country code, e.g., "+16505553434"
  
  async function sendWhatsAppMessage() {
    try {
      const response = await axios.post(
        `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: "whatsapp",
          to: RECIPIENT_NUMBER,
          type: "text",
          text: { body: "Hello! This is a test message from WhatsApp Business API." },
        },
        {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Message sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending WhatsApp message:", error.response ? error.response.data : error.message);
    }
  }

//function for searching tutor
async function tutorSearch(category, utcDateTime) {
    // Convert utcDateTime to a "HH:mm:ss" string in UTC.
    const providedTimeString = new Date(utcDateTime).toISOString().slice(11, 19);

    let tutor = await Tutor.findOneAndUpdate(
        {
        status: "approved",
        freeTrial: "eligible",
        "skills.skill": category,
        $expr: {
            $in: [
            providedTimeString,
            {
                $map: {
                input: "$availableTimes",
                as: "time",
                in: {
                    $dateToString: { 
                    date: { $dateFromString: { dateString: "$$time" } }, 
                    format: "%H:%M:%S", 
                    timezone: "UTC" 
                    } 
                }
                }
            }
            ]
        }
        },
        { $inc: { freeTrialCount: 1 } },
        {
        sort: { freeTrialCount: 1 },
        projection: { username: 1, mobilenumber: 1, timezone: 1 },
        new: true // returns the updated document
        }
    );

    if (!tutor) {
        tutor = { username: "system", mobilenumber: "+919999999999", timezone: "Asia/Kolkata" };
    }
    return tutor;
}    

module.exports = { createGoogleMeetAndSendEmail, deleteGoogleMeet, tutorSearch, createGoogleMeetLink,sendWhatsAppMessage};
