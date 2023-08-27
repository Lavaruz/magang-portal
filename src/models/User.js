module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
      "User",
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
          unique: true,
        },
        googleId:DataTypes.STRING,
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
      },
      {
        timestamps: false,
      }
    );
    return User;
  };
  