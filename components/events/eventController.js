const { Event, Profile } = require('../../models');
const error = require('../../middlewares/errorHandling/errorConstants');

exports.createEvent = async (req, res) => {
  try {
    const { profileId } = req.params;
    const { title, location, dateOfEvent, timeOfEvent, linkOfEvent } = req.body;

    const profile = await Profile.findOne({
      where: {
        id: profileId
      }
    })

    if (!profile) {
      throw new Error(error.NOT_FOUND);
    }

    const today = new Date().toISOString().slice(0, 10);
    if (dateOfEvent && new Date(dateOfEvent) < new Date(today)) {
      throw new Error("Event cannot be in past");
    }


    const event = await Event.create({
      title,
      location: location || null,
      dateOfEvent: dateOfEvent || null,
      timeOfEvent: timeOfEvent || null,
      linkOfEvent: linkOfEvent || null,
      profileId
    });

    return res.status(201).json({ message: 'Event created successfully', event });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while creating the event.' });
  }
};
exports.getProfileEvents = async (req, res) => {
  try {
    const { profileId } = req.params;
    console.log(profileId);
    const events = await Event.findAll({
      where: {
        profileId: profileId
      }
    });

    if (events.length === 0) {
      return res.status(404).json({ message: 'No events found for this profile.' });
    }

    return res.status(200).json(events);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while fetching events.' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;


    const event = await Event.findOne({
      where: {
        id: eventId
      }
    });


    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    await event.destroy();

    return res.status(200).json({ message: 'Event deleted successfully.' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while deleting the event.' });
  }
};

exports.editEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { title, location, dateOfEvent, timeOfEvent, linkOfEvent } = req.body;

    const event = await Event.findOne({
      where: { id: eventId }
    });


    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }


    if (title && title.length > 50) {
      return res.status(400).json({ message: 'Title length must be less than 50 characters.' });
    }
    if (linkOfEvent && !linkOfEvent.startsWith('http')) {
      return res.status(400).json({ message: 'Invalid URL for event link.' });
    }


    event.title = title || event.title;
    event.location = location || event.location;
    event.dateOfEvent = dateOfEvent || event.dateOfEvent;
    event.timeOfEvent = timeOfEvent || event.timeOfEvent;
    event.link = linkOfEvent || event.linkOfEvent;


    await event.save();

    return res.status(200).json({ message: 'Event updated successfully.', event });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while updating the event.' });
  }
};