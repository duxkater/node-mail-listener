var MailListener = require("mail-listener2");

module.exports = function(infos, whitelist, callback) {

	function allow(address) {

		for (var i in whitelist) {

			let row = whitelist[i];

			if (row.substring(0, 1) === '*') {
				if (address.split('@')[1] === row.split('@')[1])
					return true;
				continue;
			}

			if (address === row)
				return true;

			continue;

		}

		return false;

	}

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

			if (!allow(mail.from[0].address))
				return false;

			callback(mail);
			
		});

	}

};