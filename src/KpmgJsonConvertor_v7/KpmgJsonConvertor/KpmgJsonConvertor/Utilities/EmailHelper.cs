using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;
using System.IO;
using System.Net;
using System.Net.Mail;

using Email.Net.Smtp;
using Email.Net.Common.Collections;
using Email.Net.Common;
using Email.Net.Common.Configurations;

namespace KpmgJsonConvertor.Utilities
{
    class EmailHelper
    {
        /// <summary>
        /// Send email using settings
        /// </summary>
        /// <returns>Returns true or false if an email sent or not</returns>
        public static SendResult SendEmail(Dictionary<string, string> attachments)
        {
            try
            {
                Email.Net.Smtp.SmtpClient target = new Email.Net.Smtp.SmtpClient();
                target.Host = ConfigurationManager.AppSettings["email.smtp.server"];
                target.Port = (ushort)Convert.ToInt16(ConfigurationManager.AppSettings["email.smtp.port"]);
                target.Username = ConfigurationManager.AppSettings["email.smtp.username"];
                target.Password = ConfigurationManager.AppSettings["email.smtp.password"];

                if (bool.Parse(ConfigurationManager.AppSettings["email.smtp.enableSsl"]))
                {
                    target.SSLInteractionType = EInteractionType.SSLPort;
                }

                EmailAddressCollection addressCollection = new EmailAddressCollection();
                addressCollection.Add(new EmailAddress(ConfigurationManager.AppSettings["email.address.to"]));               

                SmtpMessage message = new SmtpMessage(
                    new EmailAddress(ConfigurationManager.AppSettings["email.address.from"], "No.Reply"), //Source address
                    addressCollection, //Address of the recipient
                    "FTSE350 Online Chart user data", //Message subject
                    "Please find attached the FTSE350 Online Chart user data." //Message text
                    );

                message.TextContentType = ETextContentType.Html;
                message.PlainText = "Please find attached the question results.";

                // Add attachments if required
                if (attachments != null)
                {
                    foreach (string key in attachments.Keys)
                    {
                        if (!string.IsNullOrEmpty(attachments[key]) && File.Exists(attachments[key]))
                        {
                            Email.Net.Common.MessageParts.Attachment att = new Email.Net.Common.MessageParts.Attachment(attachments[key], new ContentType("application", "octec-stream"));
                            message.Attachments.Add(att);
                        }
                    }
                }

                SendResult result = target.SendOne(message);//Send message    
                if (!result.IsSuccessful)
                {
                    //log.Error("Mail sending failed to: " + ToEmail + ", result: " + result.Result.ToString());
                }

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public static void SendMailByAddingToQueue(string recipient, string subject, string message, Dictionary<string, string> attachments, bool isHtml, string fromDisplayName)
        {
            // Check mail settings
            if (!string.IsNullOrEmpty(recipient))
            {
                // Populate the mail message
                using (System.Net.Mail.MailMessage mailMessage = new System.Net.Mail.MailMessage()
                {
                    From = new MailAddress(ConfigurationManager.AppSettings["email.address.from"], fromDisplayName),
                    Subject = subject,
                    IsBodyHtml = isHtml,
                    Priority = MailPriority.Normal,
                    Body = message
                })
                {
                    mailMessage.To.Add(new MailAddress(recipient, recipient));

                    // Add attachments if required
                    if (attachments != null)
                    {
                        foreach (string key in attachments.Keys)
                        {
                            if (!string.IsNullOrEmpty(attachments[key]) && File.Exists(attachments[key]))
                            {
                                FileStream stream = new FileStream(attachments[key], FileMode.Open);
                                mailMessage.Attachments.Add(new Attachment(stream, key.Replace("-", "_").Replace("\\", string.Empty).Replace("/", string.Empty).Replace(" ", string.Empty)));
                            }
                        }
                    }

                    // Set properties for sending email
                    using (System.Net.Mail.SmtpClient smtpServer = new System.Net.Mail.SmtpClient()
                    {
                        Host = ConfigurationManager.AppSettings["email.smtp.server"],
                        Port = Convert.ToInt32(ConfigurationManager.AppSettings["email.smtp.port"]),
                        EnableSsl = false,
                        UseDefaultCredentials = false,
                        Credentials = new NetworkCredential(ConfigurationManager.AppSettings["email.address.from"], ConfigurationManager.AppSettings["email.address.from.password"])
                    })
                    {
                        smtpServer.DeliveryMethod = SmtpDeliveryMethod.SpecifiedPickupDirectory;
                        smtpServer.PickupDirectoryLocation = ConfigurationManager.AppSettings["email.pickupDirectory"];

                        smtpServer.Send(mailMessage);
                    }
                }
            }
        }
    }
}
