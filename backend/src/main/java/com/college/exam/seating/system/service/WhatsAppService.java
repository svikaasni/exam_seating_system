package com.college.exam.seating.system.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class WhatsAppService {

    // ✅ Load from application.properties (SECURE)
    @Value("${twilio.account.sid}")
    private String ACCOUNT_SID;

    @Value("${twilio.auth.token}")
    private String AUTH_TOKEN;

    @Value("${twilio.whatsapp.from}")
    private String FROM_NUMBER;

    private boolean initialized = false;

    // ✅ Initialize Twilio once safely
    private void initTwilio() {
        if (!initialized) {
            Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
            initialized = true;
        }
    }

    public boolean sendWhatsApp(String to, String messageText) {

        try {
            initTwilio();

            // ✅ Validate phone number
            if (to == null || to.isEmpty()) {
                return false;
            }

            // ✅ Auto-format Indian numbers
            if (!to.startsWith("+")) {
                to = "+91" + to;
            }

            Message message = Message.creator(
                    new PhoneNumber("whatsapp:" + to),
                    new PhoneNumber(FROM_NUMBER),
                    messageText
            ).create();

            System.out.println("✅ WhatsApp sent: " + message.getSid());
            return true;

        } catch (Exception e) {
            System.out.println("❌ WhatsApp failed: " + e.getMessage());
            return false;
        }
    }
}