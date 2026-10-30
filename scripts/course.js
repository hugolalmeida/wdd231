// Set completed to true only for courses you have personally completed.
// The course-array link was not included in the supplied instructions.
// These are the six standard Web and Computer Programming certificate courses;
// compare their details with the course's provided array before submission.
const courses = [
  { subject: 'CSE', number: 110, title: 'Introduction to Programming', credits: 2, completed: true },
  { subject: 'WDD', number: 130, title: 'Web Fundamentals', credits: 2, completed: true },
  { subject: 'CSE', number: 111, title: 'Programming with Functions', credits: 2, completed: true },
  { subject: 'CSE', number: 210, title: 'Programming with Classes', credits: 2, completed: true },
  { subject: 'WDD', number: 131, title: 'Dynamic Web Fundamentals', credits: 2, completed: true },
  { subject: 'WDD', number: 231, title: 'Web Frontend Development I', credits: 2, completed: false }
];

const courseList = document.querySelector('#course-list');
const courseSummary = document.querySelector('#course-summary');
const filterButtons = document.querySelectorAll('[data-filter]');

function displayCourses(filter = 'all') {
  const filteredCourses = courses.filter(course => filter === 'all' || course.subject === filter);
  const cards = filteredCourses.map(course => {
    const card = document.createElement('article');
    card.classList.add('course-card');
    card.classList.toggle('completed', course.completed);

    const heading = document.createElement('h3');
    heading.textContent = `${course.completed ? '✓ ' : ''}${course.subject} ${course.number}`;
    const title = document.createElement('p');
    title.textContent = course.title;
    const status = document.createElement('p');
    status.textContent = `${course.credits} credits · ${course.completed ? 'Completed' : 'Not completed'}`;
    card.append(heading, title, status);
    return card;
  });

  courseList.replaceChildren(...cards);
  const totalCredits = filteredCourses.reduce((total, course) => total + course.credits, 0);
  courseSummary.textContent = `Total credits for the ${filteredCourses.length} courses displayed: ${totalCredits}`;
  filterButtons.forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.filter === filter));
  });
}

filterButtons.forEach(button => {
  button.addEventListener('click', () => displayCourses(button.dataset.filter));
});
displayCourses();
