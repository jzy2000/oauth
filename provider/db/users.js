'use strict';

var users = [
  { id: '1', username: 'user1', name: 'user1', email: 'user1@user1.com', salt: '87hufrho10vr79qndj87', password: '828f8041b4c41c1e8593ea39f57cdca3ec3e614daf88883acc15ff9f8f5c7baedcf87b635a98a3d28ddf967a45bd5f3abe0ed9d617f5cb3f31a9dd4f761a2c54648e7a0b3a051047a0f26faa4e9e1bafbda130bb1d70dcf11017bfaac1df00ce6f878838816c9593ea095c7d6f2fa6953b3ec7ccdad7233240eb49dd7f1d2568716b4d6ebc06a6dd85f4a61691f4f053eb1ede9348b52551bb1885be306e51ed8af9eb9cff084c957584a8c18b352655aff1cc43de2b069a7fcc9def96684c7e106cc0dc8835436735bede28834f4b3722c9fcb1739fb74d29182709d6b4d8cdfa905610e589100f911a77ad667f747eed55ddf721ff53788190b89c56a6202130ce7bf43668b9a3ff5e663fd687656267ebc8831abb019ec651aafeb708682d887959ac1037b4b889a5b2fe4c31a21addda6215ed27b8d6d12fe76542047b9b86d002779b7885030159808f8649d5b959d5c71834abfbf88f14f09be5beb76a57a5328e8deb9666091c8292919307b340f5fe1be2cb8ef6bfb7acf9ceb007bf523a0840ec0d7c8d72644c0451e227bc7b9367a7bfbcbdc27ba317a81be16da8979c04a183529fa961c35c4b03e782656e0707377c1cbeb64e49af837b3778d5ecef534a729ea34bca56fbee4778702bba094db988613a957ac69d5bdf51df893bfec85460f8c59619d47d0366d9162b3f3c565c22c74b9040a59d36f1c71be7' },
  { id: '2', username: 'user2', name: 'user2', email: 'user2@user2.com', salt: '7991fa7e0f3b61955b18', password: '454a025e3a393ab9fe828dfaca109553d7c4166e8c4145844dcb36ec3d6daf6f9c6b22ad369460fe81d6ca1930c3fc50fa25e00e36a55448512afa49aa677d7ab8e437793574341147da33ffab0c55c71d2dd9efcf5d23f689a6dbe8bd7d26642407352f44bc570228625e01e4f02c887c0c4ef8b5c843e7467c31e321be0f96b9c6a480e03d1b62d64d08cc9cf8365351f8af0b7828956eb9306f43f4dcfd37dfa465f298b7a5585d8b7b96d995abeaf0a3dfc6d3117c01edc441a40f3f9b250aff665885b5148cd487b0d03850486eb9599f638420893d5903722cc5520d4f6eb6b4b74d05f840d4aa25f2290a311de9e1eec05edc4c7a30f38fae52fbb490c8ffa486b92276e792276290fe14f7b4825eaa34225ea5e3987915bd2f0e8957a6feac47fae46a9967956bae8f957f3129dcaf795b0b0986e11eac186f8a71c2a1b4bb47dfc2ba28c367b8c3da3eea4ee96c5e17ac304b862137b3defb8989ddac52d4d3c9975d85fea65c606cc109b2e57c40f4f03667e203f4c1caecc0682f300bdcbc55e007b62555eafedd44866f38aef912ce3300f90ae36db3f8ef34bc218e90ef026e02d210134748510d7e21a792d25b0ba3cf7b5d37cf4f8361231f033d33f9a217f063d6ae65a72bc11936d599749a9018d0c9f0984c678fadd5c3e16ed5d227c466053fa14215ab61779f8ef735b09a61a5c6970120dd5c869023'  },
];

module.exports.findByUserId = (id, done) => {
  for (let i = 0, len = users.length; i < len; i++) {
    if (users[i].id === id) return done(null, users[i]);
  }
  return done(new Error('User Not Found'));
};

module.exports.findByUsername = (username, done) => {
  for (let i = 0, len = users.length; i < len; i++) {
    if (users[i].username === username) return done(null, users[i]);
  }
  return done(new Error('User Not Found'));
};

module.exports.addUser = (username, name, email, salt, password, done) => {
  users[users.length] = {id: String(users.length+1), username: username, name: name, email:email, salt:salt, password: password};
  return done(null, users[users.length-1]);
};