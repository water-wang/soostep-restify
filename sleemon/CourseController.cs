namespace Sleemon.Portal.Controllers
{
    using System;
    using System.Web.Mvc;
    using Microsoft.Practices.Unity;
    using Sleemon.Data;

    public class CourseController : CoreController
    {
        private readonly LearningFileModelClient _learningFileModelClient;

        public CourseController(
            [Dependency] UserModelClient userModelClient,
            [Dependency] LearningFileModelClient learningFileModelClient)
            : base(userModelClient)
        {
            this._learningFileModelClient = learningFileModelClient;
        }

        [Authorization]
        [HttpGet]
        public ActionResult Index(int pageIndex, int pageSize, string courseTitle)
        {
            ViewBag.pageIndex = pageIndex;
            ViewBag.CurrentUserId = CurrentUserUniqueId;

            var courseList = _learningFileModelClient.GetCourseList(pageIndex, pageSize, courseTitle);

            return PartialView("CourseList", courseList);
        }

        [HttpGet]
        public ActionResult Detail(int id)
        {
            var course = _learningFileModelClient.GetCourseDetailById(id);

            return PartialView("CourseDetail", course);
        }

        [Authorization]
        [HttpGet]
        public ActionResult CourseCreate(int id = 0)
        {
            var course = id == 0 ? new LearningCourseDetailModel() : _learningFileModelClient.GetCourseDetailById(id);

            return PartialView("CourseCreate", course);
        }

        [HttpPost, ValidateInput(false)]
        public ActionResult CourseCreate(LearningCourseDetailModel course)
        {
            ViewBag.Result = "Save successful.";
            var validation = ValidateModelForCourse(course);
            if (string.IsNullOrEmpty(validation))
            {
                EnrichCourseDetailModel(course);
                var result = _learningFileModelClient.SaveCourseDetail(course);
                if (!result.IsSuccess)
                {
                    ViewBag.Result = result.Message;
                }
            }
            else
            {
                ViewBag.Result = validation;
            }

            return PartialView("CourseCreate", course);
        }
        
        [HttpPost, ValidateInput(false)]
        public ActionResult DeleteCourse(int id)
        {
            var msg = "Delete successful.";
            var course = _learningFileModelClient.GetCourseDetailById(id);
            if (course != null && course.LastUpdateUser == CurrentUserUniqueId)
            {
                var result = _learningFileModelClient.DeleteCourseById(id);
                if (!result.IsSuccess)
                {
                    msg = result.Message;
                }
            }
            else
            {
                msg = @"Course info is not found.";
            }

            return new JsonResult() { Data = msg };
        }
        
        private void EnrichCourseDetailModel(LearningCourseDetailModel course)
        {
            throw new NotImplementedException();
        }

        private string ValidateModelForCourse(LearningCourseDetailModel course)
        {
            throw new NotImplementedException();
        }
    }
}