var MailListener = require("mail-listener2");

module.exports = function(infos, callback) {

	for (var i in infos) {

		var info = infos[i];

		var mailListener = new MailListener({
			username: info.login,
			password: info.pass,
			host: info.imap,
			port: 993,
			tls: true,
			tlsOptions: {
				rejectUnauthorized: false
			},
			markSeen: false,
			fetchUnreadOnStart: false,
			mailbox: "INBOX",
		});

		mailListener.start();

		mailListener.on("error", function(err) {
			console.log(err);
		});

		mailListener.on("mail", function(mail, seqno, attributes) {
			callback(mail, info.login);
		});

	}

};