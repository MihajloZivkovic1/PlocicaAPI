
const error = require('../../middlewares/errorHandling/errorConstants');
const { Profile, Story } = require('../../models');



exports.createStory = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, text } = req.body;
    console.log(id);
    const profile = await Profile.findOne({
      where: {
        id: id
      }
    })

    if (!profile) {
      throw new Error(error.NOT_FOUND);
    }

    // if (title.length > 20) {
    //   throw new Error("Max length is 20");
    // }
    // if (text.length > 255) {
    //   throw new Error("Max length is 255 characters");
    // }

    const story = await Story.create({
      title: title,
      text: text,
      profileId: id
    })


    await story.save();

    return res.status(200).json({ message: "Story created successfully", story });

  } catch (error) {
    console.error(error);
  }
}
exports.getAllProfileStories = async (req, res) => {
  try {
    const { id } = req.params

    const profile = await Profile.findOne({
      where: {
        id: id
      }
    })

    if (!profile) {
      throw new Error(error.NOT_FOUND);
    }
    const stories = await Story.findAll({
      where: {
        profileId: id
      }
    })

    return res.status(200).send({
      stories
    });

  } catch (error) {
    console.error(error)
  }

}

exports.deleteProfileStory = async (req, res) => {
  try {
    const { storyId } = req.body;

    console.log(storyId);
    const story = await Story.findOne({
      where: {
        id: storyId
      }
    })
    if (!story) {
      throw new Error(error.NOT_FOUND);
    }
    if (!storyId) {
      throw new Error(error.NOT_FOUND);
    }

    await Story.destroy({
      where: {
        id: storyId
      }
    })

    return res.status(200).send({
      message: "Story deleted successfully"
    })

  } catch (error) {
    console.error(error);
  }
}
exports.updateStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { title, text, published } = req.body;



    // const profile = await Profile.findOne({ where: { id: id } });

    // if (!profile) {
    //   return res.status(404).json({ message: "Profile not found" });
    // }


    const story = await Story.findOne({ where: { id: storyId } });

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }


    if (title && title.length > 20) {
      return res.status(400).json({ message: "Max length of the title is 20 characters" });
    }

    // if (text && text.length > 255) {
    //   return res.status(400).json({ message: "Max length of the text is 255 characters" });
    // }


    await story.update({
      title: title || story.title,
      text: text || story.text,
      published: published !== undefined ? published : story.published,
    });

    return res.status(200).send({ message: "Story updated successfully", story });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while updating the story", error: error.message });
  }
}