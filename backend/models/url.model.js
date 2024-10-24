module.exports = (sequelize, DataTypes) => {
  const Url = sequelize.define('url', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    original_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    shortened_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      userId: {
        type: DataTypes.INTEGER,
        references: 'users',
        referencesKey: 'id'
      }
    },
    clicks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

  });

  Url.associate = (models) => {
    Url.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Url;
};