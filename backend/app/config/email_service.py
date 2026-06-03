import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
# Remove spaces from app password (Gmail app passwords may have spaces)
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD", "").replace(" ", "")


def send_otp_email(recipient_email: str, otp: str):
    """
    Send OTP to user's email
    """
    try:
        # Validate configuration
        if not SENDER_EMAIL or not SENDER_PASSWORD:
            print(f"Email config error - SENDER_EMAIL: {SENDER_EMAIL}, PASSWORD: {'***' if SENDER_PASSWORD else 'NOT SET'}")
            return False

        # Create message
        message = MIMEMultipart("alternative")
        message["Subject"] = "Password Reset OTP - Employee Management System"
        message["From"] = SENDER_EMAIL
        message["To"] = recipient_email

        # HTML content for the email
        html = f"""\
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
              <h2 style="color: #0ea5e9; text-align: center;">Password Reset Request</h2>
              
              <p>Hello,</p>
              
              <p>You've requested to reset your password. Please use the following One-Time Password (OTP) to proceed:</p>
              
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                <h1 style="color: #0ea5e9; margin: 0; letter-spacing: 5px;">{otp}</h1>
              </div>
              
              <p><strong>Note:</strong> This OTP will expire in 10 minutes. Do not share this code with anyone.</p>
              
              <p>If you didn't request a password reset, please ignore this email.</p>
              
              <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
              
              <p style="text-align: center; color: #666; font-size: 12px;">
                Employee Management System<br>
                This is an automated email, please do not reply.
              </p>
            </div>
          </body>
        </html>
        """

        # Attach HTML to message
        message.attach(MIMEText(html, "html"))

        # Send email with better error handling
        print(f"Attempting to send OTP email to {recipient_email}")
        print(f"SMTP Server: {SMTP_SERVER}:{SMTP_PORT}")
        print(f"From: {SENDER_EMAIL}")
        
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=10) as server:
            server.set_debuglevel(1)  # Enable debug output
            server.starttls()  # Secure the connection
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, recipient_email, message.as_string())

        print(f"OTP email sent successfully to {recipient_email}")
        return True

    except smtplib.SMTPAuthenticationError as e:
        print(f"SMTP Authentication Error: {str(e)}")
        print("Check your SENDER_EMAIL and SENDER_PASSWORD in .env file")
        return False
    except smtplib.SMTPException as e:
        print(f"SMTP Error: {str(e)}")
        return False
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        import traceback
        traceback.print_exc()
        return False
