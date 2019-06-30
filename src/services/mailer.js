const nodemailer = require('nodemailer')
class NodeMailer {
    constructor(appName, provider, sender, template) {
        this.appName = appName
        this.provider = provider
        this.sender = sender
        this.template = template
    }

    send(receiver, content) {
        let transporter = nodemailer.createTransport({
            service: this.provider,
            secure: true,
            auth: this.sender
        });
        let mailOptions = {
            from: `"${this.appName}" <${this.sender.user}>`,
            to: receiver,
            subject: this.template.subject,
            text: this.template.text(content),
        };

        return new Promise((resolver, reject) => {
            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    reject(null);
                } else {
                    resolver(info);
                }
            })
        });
    }
}

const MAIL_PROVIDERS = {
    GMAIL: 'gmail'
}

const GetMailSender = provider => {
    switch (provider) {
        case MAIL_PROVIDERS.GMAIL: {
            return {
                user: 'tltbushcmus@gmail.com',
                pass: 'TLTbus123'
            }
        }
    }
}

const MAIL_TEMPLATES = {
    NEW_BOOKING: {
        subject: 'Đơn đặt phòng mới',
        text: (content) => {
            return "Đơn hàng: " + content.bookingId + ".\n" +
                "Mã phòng đặt: " + content.roomId + "\n" +
                "Tiết bắt đầu: " + content.startId + "\n" +
                "Tiết kết thúc: " + content.endId + "\n" +
                "Ngày đặt: " + content.bookingDate + "\n" +
                "Bạn vui lòng đợi quản trị viên duyệt đơn hàng (tối đa là 2 ngày)"
        }
    },
    BOOKING_ACCEPTED: {
        subject: 'Đơn đặt phòng - Chấp nhận',
        text: (content) => {
            return "Đơn hàng: " + content.bookingId + ".\n" +
                "Mã phòng đặt: " + content.roomId + "\n" +
                "Tiết bắt đầu: " + content.startId + "\n" +
                "Tiết kết thúc: " + content.endId + "\n" +
                "Ngày đặt: " + content.bookingDate + "\n" +
                "Đơn đặt phòng của bạn đã được chấp nhận"
        }
    },
    BOOKING_REJECTED: {
        subject: 'Đơn đặt phòng - Từ chối',
        text: (content) => {
            return "Đơn hàng: " + content.bookingId + ".\n" +
                "Mã phòng đặt: " + content.roomId + "\n" +
                "Tiết bắt đầu: " + content.startId + "\n" +
                "Tiết kết thúc: " + content.endId + "\n" +
                "Ngày đặt: " + content.bookingDate + "\n" +
                "Đơn đặt phòng của bạn đã bị từ chối"
        }
    },
    BOOKING_PENDING: {
        subject: 'Đơn đặt phòng - Chờ duyệt',
        text: (content) => {
            return "Đơn hàng: " + content.bookingId + ".\n" +
                "Mã phòng đặt: " + content.roomId + "\n" +
                "Tiết bắt đầu: " + content.startId + "\n" +
                "Tiết kết thúc: " + content.endId + "\n" +
                "Ngày đặt: " + content.bookingDate + "\n" +
                "Đơn đặt phòng của bạn hiện đang được chờ duyệt"
        }
    }
}

class NodeMailerBuilder {
    constructor(appName) {
        this.appName = appName
    }
    buildNewBooking(provider) {
        const sender = GetMailSender(provider)
        return new NodeMailer(this.appName, provider, sender, MAIL_TEMPLATES.NEW_BOOKING)
    }
    buildBookingAccepted(provider) {
        const sender = GetMailSender(provider)
        return new NodeMailer(this.appName, provider, sender, MAIL_TEMPLATES.BOOKING_ACCEPTED)
    }
    buildBookingRejected(provider) {
        const sender = GetMailSender(provider)
        return new NodeMailer(this.appName, provider, sender, MAIL_TEMPLATES.BOOKING_REJECTED)
    }
    buildBookingPending(provider) {
        const sender = GetMailSender(provider)
        return new NodeMailer(this.appName, provider, sender, MAIL_TEMPLATES.BOOKING_PENDING)
    }
}

module.exports = {
    MAIL_PROVIDERS,
    NodeMailerBuilder,
    NodeMailer
}