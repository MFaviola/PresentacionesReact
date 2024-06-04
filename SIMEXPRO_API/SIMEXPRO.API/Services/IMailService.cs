using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SIMEXPRO.API.Services
{
    public interface IMailService
    {
        bool SendMail(MailData mailData);

        Task<bool> SendMailAsync(MailData mailData);
    }
}
