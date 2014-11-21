using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Ionic.Zip;
using System.IO;
using KpmgJsonConvertor.Utilities;
using System.Configuration;

namespace KpmgJsonConvertor
{
    class KpmgProcessor
    {
        string _jsonFilePath;
        string _txtFilePath;
        string _zipfilePath;

        internal void ProcessFile(string filePath, out string error, out Utilities.Enums.Status status)
        {
            status = Utilities.Enums.Status.FAIL;
            error = "";

            try
            {
                _jsonFilePath = filePath;
                _txtFilePath = Path.Combine(Path.GetDirectoryName(filePath), Path.GetFileNameWithoutExtension(_jsonFilePath) + ".txt");
                _zipfilePath = Path.Combine(Path.GetDirectoryName(filePath), "ftse350_chart_userdata_" + Path.GetFileNameWithoutExtension(_jsonFilePath) + ".zip");

                string textFileContent = GetTextFileContent(_jsonFilePath);
                File.WriteAllText(_txtFilePath, textFileContent);

                Utilities.Enums.Status zipStatus = ZipFile(out error);
                if (zipStatus == Utilities.Enums.Status.OK)
                {
                    EmailFile();
                    status = Utilities.Enums.Status.OK;
                }
            }
            catch (Exception ex)
            {
                error = ex.ToString();
                status = Utilities.Enums.Status.FAIL;
            }
            finally
            {
                //delete txt and zip. json will be moved in Program.cs
                File.Delete(_txtFilePath);
                File.Delete(_zipfilePath);
            }
        }

        private void EmailFile()
        {
            Dictionary<string,string> fileAttachment = new Dictionary<string,string>();
            fileAttachment.Add(Path.GetFileName(_zipfilePath),_zipfilePath);
            EmailHelper.SendEmail(fileAttachment);
        }

        private Utilities.Enums.Status ZipFile(out string error)
        {
            error = "";
            Utilities.Enums.Status status = Utilities.Enums.Status.OK;
            try
            {
                using (var zip = new ZipFile())
                {
                    zip.Password = "RqY3eLnp";
                    zip.AddFile(_txtFilePath, "");
                    zip.Save(_zipfilePath);
                }
            }
            catch (Exception ex)
            {
                status = Utilities.Enums.Status.FAIL;
                error = ex.ToString();
            }
            return status;
        }

        private string GetTextFileContent(string filePath)
        {
            string json = File.ReadAllText(filePath);

            //var ddd = JsonConvert.DeserializeObject<List<Dictionary<string, Dictionary<string, string>>>>(fileContent);
            dynamic dynObj = JsonConvert.DeserializeObject(json);

            StringBuilder sb = new StringBuilder();
            sb.AppendLine("Date");
            sb.AppendLine(DateTime.Now.ToString("D"));
            sb.AppendLine();

            if (dynObj.Count == 0)
            {
                return "";
            }
                       
            //start at one as we don't need "SelectedQuestion"
            for (int x = 1; x < dynObj.Count; x++)
            {
                if (dynObj[x].question != null)
                {
                    sb.AppendLine(String.Format("{0}\r\n{1}\r\n", dynObj[x].question.ToString().Trim(), dynObj[x].answer.ToString().Trim()));
                    ////DIRTY - name, company, email and subject are in each question, rather than once in the file...
                    //if (name == "" && dynObj[x].userName != null)
                    //{
                    //    name = dynObj[x].userName.ToString().Trim();
                    //}
                    //if (company == "" && dynObj[x].userCompany != null)
                    //{
                    //    company = dynObj[x].userCompany.ToString().Trim();
                    //}
                    //if (email == "" && dynObj[x].userEmail != null)
                    //{
                    //    email = dynObj[x].userEmail.ToString().Trim();
                    //}
                    //if (subject == "" && dynObj[x].subject != null)
                    //{
                    //    subject = dynObj[x].userSubject.ToString().Trim();
                    //}
                }
                else if (dynObj[x].userName != null)
                {
                    sb.AppendLine(String.Format("Name\r\n{0}\r\n", dynObj[x].userName.ToString().Trim()));
                }
                else if (dynObj[x].userCompany != null)
                {
                    sb.AppendLine(String.Format("Company\r\n{0}\r\n", dynObj[x].userCompany.ToString().Trim()));
                }
                else if (dynObj[x].userEmail != null)
                {
                    sb.AppendLine(String.Format("Email\r\n{0}\r\n", dynObj[x].userEmail.ToString().Trim()));
                }
                else if (dynObj[x].userSubject != null)
                {
                    sb.AppendLine(String.Format("Subject\r\n{0}\r\n", dynObj[x].userSubject.ToString().Trim()));
                }
            }

            return sb.ToString();
        }
    }
}
