const { Group, Profile, Link } = require('../../models');
const error = require('../../middlewares/errorHandling/errorConstants');

exports.createGroup = async (req, res) => {
  const { profileId } = req.params;
  const { name } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ message: error.MISSING_PARAMETERS });
    }

    const profile = await Profile.findOne({
      where: { id: profileId },
    });

    if (!profile) {
      return res.status(404).json({ message: error.NOT_FOUND });
    }

    const group = await Group.create({
      name: name,
      profileId,
    });

    return res.status(201).json({
      message: "Group created successfully",
      group,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "An error occurred while creating the group." });
  }
};


exports.createGroupAndLinks = async (req, res) => {
  const { profileId } = req.params;
  const { name, links } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ message: error.MISSING_PARAMETERS });
    }

    const profile = await Profile.findOne({
      where: {
        id: profileId,
      },
    });

    if (!profile) {
      return res.status(404).json({ message: error.NOT_FOUND });
    }


    const group = await Group.create(
      {
        name: name,
        profileId,
        Links: links,
      },
      {
        include: [
          {
            model: Link,
            as: 'Links',
          },
        ],
      }
    );
    9
    return res.status(201).json({
      message: 'Group created successfully',
      group,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'An error occurred while creating new group.' });
  }
};

exports.deleteGroup = async (req, res) => {
  const { groupId } = req.params;
  try {

    const group = await Group.findOne({
      where: {
        id: groupId
      }
    })

    if (!group) {
      return res.status(404).json({ message: error.NOT_FOUND });
    }


    await group.destroy();

    return res.status(200).json({
      message: "Group delete successfully"
    })


  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while deleting the group.' });
  }

}

exports.getProfilesGroups = async (req, res) => {
  const { profileId } = req.params;

  try {
    const profile = await Profile.findOne({
      where: {
        id: profileId
      }
    })


    if (!profile) {
      return res.status(404).json({
        message: error.NOT_FOUND
      })
    }

    const groups = await Group.findAll({
      where: {
        profileId: profileId
      },
      include: [
        {
          model: Link,
          as: 'Links'
        }
      ]
    })

    if (groups.length === 0) {
      return res.json({
        message: "No groups found for this user",
        groups: []
      })
    }


    return res.status(200).json({
      message: "Groups returned successfully",
      groups
    })
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred while fetching groups.' });

  }
}