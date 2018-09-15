module.exports = function(sequelize, DataTypes) {
    var Restaurant = sequelize.define("Restaurant", {
      name: {
          type: DataTypes.STRING,
          allowNull: false
      },
      visited: {
          type: DataTypes.BOOLEAN,
          defaultValue:false
      },
      liked: { 
          type: DataTypes.BOOLEAN,
          defaultValue:false
      }
    });

    Restaurant.associate = function (models) {
        models.Restaurant.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
    }
    return Restaurant;
};
