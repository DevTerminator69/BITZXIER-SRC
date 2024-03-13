const {
    MessageEmbed
  } = require("discord.js");
  
  module.exports = {
    name: "profile",
    aliases: ["badge", "badges", "achievement", "pr"],
    category: "info",
    premium: true,
    run: async (client, message, args ) => {
      
        const user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
        
    
  
        const destroyer = user.id === "1180425876798701588" ? true : false;
        let badges = "";
      
       const guild = await client.guilds.fetch("873228243757596672"); 
  
        const sus = await guild.members.fetch(user.id).catch((e) => {
          
        if(user) badges = badges;
        else badges = "`No Badge Available`";
       });
  
       if(destroyer === true || user.id === "1180425876798701588") badges = badges + `\n<:bitzxier:1180449001934442516>・**[The Terminator </>](https://discord.com/users/1180425876798701588)**`;
      
  try{
        

       const dev = sus.roles.cache.has("1183474689725702214");
     if(dev === true) badges = badges+`\n<a:Developer:1183475823831945226>・**Developer**`;

     const own = sus.roles.cache.has("1181521596163301457");
        if(own === true) badges = badges+`\n<a:OWNER:1183476311038111865>・**Owner**`;

        const han = sus.roles.cache.has("1181521598352719922");
        if(han === true) badges = badges + `\n<:Admin:1183476832725647380>・**Admin**`;

        const manager = sus.roles.cache.has("1181521599137062964");
        if(manager === true) badges = badges + `\n<:mods:1183478179390816257>・**Mod**`;

       const aman = sus.roles.cache.has("1181521604862279730");
        if(aman === true) badges = badges + `\n<a:mod:1183478099619365015>・**Support Team**`;

        const hundi = sus.roles.cache.has("1181521600886091826");
        if(hundi === true) badges = badges + `\n<:bug_hunter:1183478509922943108>・**Bug Hunter**`;

        const supp = sus.roles.cache.has("1181521601708175392");
        if(supp === true) badges = badges + `\n<a:supporter:1183478957660704859>・**Supporter**`;

        const fr = sus.roles.cache.has("1181521603201351681");
        if(fr === true) badges = badges + `\n<:Friendship:1183479192185217045>・**Friends**`;
  
  
  
  }catch(err){
  if(badges) {
  badges = "";
  badges = badges;
  }
  else if(badges === "") badges = "`No Badge Available`";
  }
  
  
        const pr = new MessageEmbed()
  .setAuthor(`Profile For ${user.username}#${user.discriminator}`, client.user.displayAvatarURL({dynamic: true})) 
  .setThumbnail(user.displayAvatarURL({dynamic: true}))
  //.setTitle(`${user.username}'s Profile`)
  .setColor(client.color)
  .setTimestamp()
  .setDescription(`**BADGES** <a:boost:1183480032035876936>
  ${badges ? badges : "`No Badge Available`"}`)
  //.setTimestamp();
        message.channel.send({embeds: [pr]});
        
      }
    };