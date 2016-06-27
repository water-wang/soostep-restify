using System;
using System.Linq;
using Microsoft.Practices.ObjectBuilder2;
using Sleemon.Common;
using Sleemon.Data;

namespace Sleemon.Portal.Controllers
{
    using Microsoft.Practices.Unity;
    using System.Web.Mvc;

    public class ExamController : CoreController
    {
        private readonly ExamModelClient _examModelClient;

        public ExamController(
            [Dependency] UserModelClient userModelClient,
            [Dependency] ExamModelClient examModelClient)
            : base(userModelClient)
        {
            this._examModelClient = examModelClient;
        }

        /// <summary>
        /// Exam list
        /// </summary>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <param name="examTitle"></param>
        /// <returns></returns>
        [Authorization]
        [HttpGet]
        public ActionResult Index(int pageIndex, int pageSize, string examTitle)
        {
            ViewBag.pageIndex = pageIndex;
            ViewBag.CurrentUserId = CurrentUserUniqueId;

            var examList = _examModelClient.GetExamList(pageIndex, pageSize, examTitle);
            return PartialView("ExamList", examList);
        }

        [HttpGet]
        public ActionResult Detail(int id)
        {
            var exam = _examModelClient.GetExamDetailById(id);
            return PartialView("ExamDetail", exam);
        }

        [Authorization]
        [HttpGet]
        public ActionResult ExamCreate(int id = 0)
        {
            var exam = id == 0 ? new ExamDetailModel() : _examModelClient.GetExamDetailById(id);
            return PartialView("ExamCreate", exam);
        }

        [HttpPost, ValidateInput(false)]
        public ActionResult ExamCreate(ExamDetailModel exam)
        {
            ViewBag.Result = "Save successful.";
            var validation = ValidateModelForExam(exam);
            if (string.IsNullOrEmpty(validation))
            {
                EnrichExamDetailModel(exam);
                var result = _examModelClient.SaveExamDetail(exam);
                if (!result.IsSuccess)
                {
                    ViewBag.Result = result.Message;
                }
            }
            else
            {
                ViewBag.Result = validation;
            }

            return PartialView("ExamCreate", exam);
        }

        [HttpPost, ValidateInput(false)]
        public ActionResult DeleteExam(int id)
        {
            var msg = "Delete successful.";
            var exam = _examModelClient.GetExamDetailById(id);
            if (exam != null && exam.LastUpdateUser == CurrentUserUniqueId)
            {
                var result = _examModelClient.DeleteExamById(id);
                if (!result.IsSuccess)
                {
                    msg = result.Message;
                }
            }
            else
            {
                msg = @"Exam info is not found.";
            }

            return new JsonResult() {Data = msg};
        }

        private string ValidateModelForExam(ExamDetailModel exam)
        {
            return string.Empty;
        }
        
        private void EnrichExamDetailModel(ExamDetailModel exam)
        {
            exam.LastUpdateUser = CurrentUserUniqueId;

            for (int i = 0; i < exam.Questions.Count; i++)
            {
                var question = exam.Questions[i];
                question.No = (short) (i + 1);
                
                for (int j = 0; j < question.Choices.Count; j++)
                {
                    var choice = question.Choices[j];
                    choice.Choice = (byte)(j + 1);
                }

                var answers = question.Choices.Where(u => u.IsAnswer).ToList();
                question.CorrectAnswer = answers.Select(u => u.Choice).JoinStrings(",");
                question.Category = answers.Count == 1
                    ? (byte)ExamQuestionCategory.SingleOption
                    : (byte)ExamQuestionCategory.MultiOptions;
            }
        }
    }
}