const { Group, Profile, Link } = require('../../models');
const error = require('../../middlewares/errorHandling/errorConstants');



exports.createLink = async (req, res) => {
  const { groupId } = req.params;
  const { url, title, description } = req.body;

  try {
    if (!url) {
      return res.status(400).json({ message: error.MISSING_PARAMETERS });
    }

    const group = await Group.findOne({
      where: { id: groupId },
    });

    if (!group) {
      return res.status(404).json({ message: error.NOT_FOUND });
    }

    const link = await Link.create({
      url: url,
      title: title || null,
      description: description || null,
      groupId: groupId,
    });

    return res.status(201).json({
      message: "Link created successfully",
      link,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "An error occurred while creating the link." });
  }
};

exports.deleteLink = async (req, res) => {
  const { linkId } = req.params

  console.log(linkId);
  try {

    if (!linkId) {
      return res.status(404).json({ message: error.NOT_FOUND });
    }

    const link = await Link.findOne({
      where: {
        id: linkId
      }
    })

    await link.destroy();

    return res.status(200).json({
      message: "Link deleted successfully"
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while deleting the link.' });
  }
}

exports.getLinks = async (req, res) => {
  const { groupId } = req.params;

  try {

    const group = await Group.findOne({
      where: {
        id: groupId
      }
    })

    if (!group) {
      return res.status(404).json({
        message: error.NOT_FOUND
      })
    }

    const links = await Link.findAll({
      where: {
        groupId: groupId
      }
    })


    return res.status(200).json({
      message: "Links returned sucessfully",
      links
    })
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred while fetching links.' });
  }
}


exports.updateLink = async (req, res) => {
  const { linkId } = req.params;
  const { url, title, description } = req.body;

  try {

    const link = await Link.findOne({
      where: {
        id: linkId,
      },
    });

    if (!link) {
      return res.status(404).json({ message: error.NOT_FOUND });
    }

    link.url = url || link.url;
    link.title = title || link.title;
    link.description = description || link.description;


    await link.save();

    return res.status(200).json({
      message: 'Link updated successfully',
      link,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'An error occurred while updating the link.' });
  }
};
