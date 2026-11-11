/*
  All the words on the site that change often live here.
  Edit this file, save, refresh. No build step.
*/
window.SITE = {
  profile: {
    name: "Yuri Carnino",
    email: "ycarnino@umich.edu",
    // TODO: paste your profile URLs. Empty strings hide nothing: the site shows a reminder until you fill them in.
    linkedin: "",
    github: "",
    // Optional: a Formspree (or similar) endpoint, e.g. "https://formspree.io/f/abcdwxyz".
    // Leave empty and the contact form opens the visitor's email app with the message filled in.
    formEndpoint: ""
  },

  /*
    place: where the project shows up on the map.
      "annarbor" | "saline" | "milwaukee" | "sansebastian"
    kind: used by the filter on the projects page.
      "Internship" | "Research" | "Course project" | "Leadership"
    featured: true puts it on the home page (keep it to four).
  */
  projects: [
    {
      id: "milwaukee-tool",
      title: "Seven times the wireless range on a connected power tool",
      org: "Milwaukee Tool",
      role: "Electrical Engineering Intern",
      place: "milwaukee",
      where: "Milwaukee, Wisconsin",
      when: "May to August 2026",
      kind: "Internship",
      featured: true,
      stack: ["Altium", "ANSYS HFSS", "Hardware-in-the-loop", "RF"],
      metrics: [
        { value: "5 → 35 ft", label: "maximum wireless range for end users" },
        { value: "2 weeks → 6 hours", label: "telemetry regression testing" }
      ],
      problem: "The tool's own enclosure caused electromagnetic interference that held wireless range to about 5 feet. Separately, validating tool telemetry by hand took two weeks every regression cycle.",
      myRole: "Electrical engineering intern. I owned the antenna study and built the test bench.",
      action: "Modeled PCB antenna geometries in Altium, then analyzed S-parameters and radiation patterns in ANSYS HFSS to find a geometry that works inside the enclosure. Built a hardware-in-the-loop bench that runs telemetry validation automatically.",
      result: "Maximum range went from 5 feet to 35 feet. Regression testing dropped from two weeks to six hours."
    },
    {
      id: "ceit",
      title: "Train brake anomaly detection on a low-power microcontroller",
      org: "CEIT Technology Center",
      role: "R&D Intern",
      place: "sansebastian",
      where: "San Sebastián, Spain",
      when: "May to August 2025",
      kind: "Internship",
      featured: true,
      stack: ["STM32", "C", "NanoEdge AI Studio", "STM32CubeIDE", "LPUART"],
      metrics: [
        { value: "+10%", label: "brake anomaly identification" },
        { value: "104 Hz", label: "accelerometer logging, 2,048 samples per axis" }
      ],
      problem: "Braking failures figure in roughly 5.5% of railway accidents since 2000, and brake maintenance is mostly reactive. The lab wanted continuous monitoring that runs on a small embedded board mounted on the train.",
      myRole: "R&D intern. I brought up the firmware on a custom STM32 board and trained the on-device model.",
      action: "Wrote a real-time logger for multi-axis accelerometer data. Moved the serial link from USART2 to a low-power UART, fixed the HAL driver and interrupt bugs that kept the data-ready signal from firing, and adapted NanoEdge AI Studio, which expects ST's own boards, to the custom PCB. Then trained and deployed an anomaly detection model that learns normal braking and scores how similar each new maneuver is.",
      result: "Anomaly identification improved by 10%. The board logs reliably, returns accurate similarity scores in the detection phase, and earlier models can be saved and reflashed."
    },
    {
      id: "smolvla",
      title: "Temporal ensembling for a flow-matching robot policy",
      org: "University of Michigan, ROB 430",
      role: "Co-author, team of three",
      place: "annarbor",
      where: "Ann Arbor, Michigan",
      when: "March to April 2026",
      kind: "Research",
      featured: true,
      stack: ["PyTorch", "SmolVLA", "LeRobot", "Hugging Face", "SO-101 arms"],
      metrics: [
        { value: "15% → 55%", label: "grasp success on a deformable chip bag" },
        { value: "150", label: "teleoperated demonstrations collected" }
      ],
      problem: "SmolVLA plans robot motion in chunks of actions. At the seam between two chunks the arm jitters. Temporal ensembling fixes this for deterministic policies like ACT, but nobody had adapted it to SmolVLA's stochastic flow-matching action expert.",
      myRole: "One of three authors, with Nithin Reddy and Robert Roe. We built the arm setup, collected the data, and wrote the extension together.",
      action: "Assembled and calibrated SO-101 leader and follower arms with two RealSense cameras. Collected 50 demonstrations each for a rigid block, a makeup sponge, and a chip bag, and fine-tuned SmolVLA for 10,000 steps per task. Rewrote the policy's action selection to keep a buffer of overlapping chunks and blend them with exponentially decaying weights, with a stride setting and a fallback for an empty buffer.",
      result: "Over 20 trials per condition, chip bag success rose from 15% to 55%, the sponge stayed at 10%, and the rigid block fell from 30% to 0%. Trajectories were smoother on all three. The finding: ensembling helps tasks that want smooth, sustained motion and hurts tasks that need fast corrections."
    },
    {
      id: "overview-energy",
      title: "Tracking a moving target for laser diagnostics",
      org: "Overview Energy",
      role: "Student Researcher",
      place: "annarbor",
      where: "Ann Arbor, Michigan",
      when: "January 2026 to now",
      kind: "Research",
      featured: true,
      stack: ["C++", "ROS", "OpenCV", "Kalman filter", "Inverse kinematics"],
      metrics: [
        { value: "98%", label: "accuracy isolating optical emissions from background" },
        { value: "20 ms", label: "look-ahead to cover motor latency" }
      ],
      problem: "Camera tracking data arrives noisy and late, so a pan-tilt mount that follows it always points where the target was. Near straight up, the mount also hits a singularity where ordinary inverse kinematics demands impossible joint speeds.",
      myRole: "Student researcher on perception and pointing control.",
      action: "Built the vision pipeline in OpenCV with adaptive thresholding, spatial filtering, and contour tracking. Wrote C++ ROS nodes that process high-frame-rate camera feeds and sync laser telemetry to a low-latency GUI. Added a six-state Kalman filter that predicts the target 20 ms ahead, and damped least squares inverse kinematics with a fallback state machine for tracking, predicting, and searching.",
      result: "The pipeline isolates optical emissions with 98% accuracy. The pan-tilt mount is modeled in CAD and the tilt axis drive is the current work."
    },
    {
      id: "arv",
      title: "Leading a 40-person autonomous vehicle team",
      org: "ARV, Autonomous Robotic Vehicle",
      role: "President",
      place: "annarbor",
      where: "Ann Arbor, Michigan",
      when: "August 2023 to now",
      kind: "Leadership",
      stack: ["ROS / ROS2", "NVIDIA Isaac Sim", "Software-in-the-loop"],
      metrics: [
        { value: "40+", label: "engineers across five subteams" }
      ],
      problem: "A student team building a self-driving platform has one vehicle and many people writing software for it. Testing everything on the vehicle does not scale.",
      myRole: "President. I lead the mechanical, electrical, software, simulation, and business subteams.",
      action: "Started a dedicated simulation subteam and built software-in-the-loop pipelines in ROS and NVIDIA Isaac Sim that model vehicle dynamics and sensor feeds.",
      result: "Software gets tested in simulation before it reaches the vehicle, which shortened the team's testing cycles."
    },
    {
      id: "arcadian",
      title: "ARCADIAN, an open-source humanoid for under $7,000",
      org: "University of Michigan ARCAD Lab",
      role: "Co-developer",
      place: "annarbor",
      where: "Ann Arbor, Michigan",
      when: "August 2026 to now",
      kind: "Research",
      stack: ["Reinforcement learning", "ROS2", "MuJoCo", "C++", "Python", "Onshape"],
      metrics: [
        { value: "< $7,000", label: "target cost to build one" }
      ],
      problem: "Humanoid research hardware costs more than most students and small labs can spend, which limits who gets to work on it.",
      myRole: "Co-developer across mechanical design and the control software.",
      action: "Designing the robot in Onshape around 3D-printed structural parts and waterjet-cut links. Writing C++ and Python hardware drivers and control stacks for full-body locomotion and teleoperated manipulation, trained across Sim2Sim and Sim2Real environments.",
      result: "In progress. The goal is a design any student can build from the published files."
    },
    {
      id: "ik-solver",
      title: "Inverse kinematics solver in C++",
      org: "University of Michigan, robot operating systems",
      role: "Individual project",
      place: "annarbor",
      where: "Ann Arbor, Michigan",
      when: "February to April 2026",
      kind: "Course project",
      stack: ["C++", "Eigen", "Gauss-Newton", "Optimization"],
      metrics: [
        { value: "1e-3", label: "analytic Jacobian checked against a numerical one" }
      ],
      problem: "Given a pose you want the end of a robot arm to reach, find the joint angles that get it there. The problem is nonlinear and can have many answers or none.",
      myRole: "Individual project. I implemented the full kinematics solver.",
      action: "Wrote forward kinematics by chaining joint transforms, then the analytic geometric Jacobian that maps joint velocities to a 6D end-effector twist for revolute and prismatic joints. Solved IK iteratively with Gauss-Newton and the Moore-Penrose pseudoinverse, using an axis-angle orientation error, step scaling, and joint-limit clamping.",
      result: "The solver converges to goal poses on serial-chain robots and can return the whole joint trajectory, which drives the arm in the course simulator."
    },
    {
      id: "rix",
      title: "A publish/subscribe layer for robots, built from sockets up",
      org: "University of Michigan, robot operating systems",
      role: "Individual project",
      place: "annarbor",
      where: "Ann Arbor, Michigan",
      when: "March 2026",
      kind: "Course project",
      stack: ["C++", "TCP/IP sockets", "IPC", "Binary serialization"],
      metrics: [
        { value: "4", label: "core classes: node, publisher, subscriber, mediator" }
      ],
      problem: "Robot software is many processes that need to stream messages to each other without knowing who else is running. That is the job ROS does, and this project builds the core of it from scratch.",
      myRole: "Individual project. I implemented the node, publisher, subscriber, and discovery server.",
      action: "Built registration and deregistration with a central mediator, direct subscriber-to-publisher connections, and length-prefixed message framing. Kept the transport behind factory interfaces so the same code runs over TCP or a mock network in tests.",
      result: "Publishers and subscribers find each other through the mediator and keep running when the other side stops, which is what lets you swap one camera driver for another without touching the rest of the system."
    },
    {
      id: "ore-rover",
      title: "A rover that drives to a sample and puts it under a microscope",
      org: "University of Michigan, ENGR 100",
      role: "Team lead",
      place: "annarbor",
      where: "Ann Arbor, Michigan",
      when: "Winter 2024",
      kind: "Course project",
      stack: ["Fusion 360", "OpenCV", "Arduino", "ESP32", "FPV video"],
      metrics: [
        { value: "Sand vs. salt", label: "told apart on the live microscope feed" }
      ],
      problem: "Survey the surface of a new planet without a person on site: drive there, collect a sample, and look closely enough to tell one material from another.",
      myRole: "Team lead. I designed the camera holder, wrote the OpenCV tracking in Python, and ran the magnification testing.",
      action: "Compared holder concepts in a Pugh chart, then modeled the chosen one in Fusion 360 so it set the camera height and angle, cleared the microscope, and mounted without new holes. Tested the microscope's digital and optical magnification. The ESP32 camera tracks a red pole, estimates distance, and triggers collection on its own.",
      result: "The microscope resolved the rough, uneven grains of sand from the larger, regular crystals of salt on the video feed. The lesson that stuck: an integration bug looks like a hardware bug until you check the settings."
    },
    {
      id: "frc-5066",
      title: "Four years building competition robots",
      org: "Saline Singularity, FRC Team 5066",
      role: "Mechanical lead and team lead",
      place: "saline",
      where: "Saline, Michigan",
      when: "High school, four seasons",
      kind: "Leadership",
      stack: ["Mechanical design", "CAD", "Fabrication"],
      metrics: [
        { value: "4 seasons", label: "on the mechanical and design team" }
      ],
      problem: "Every FIRST Robotics season gives a team a new game and a few weeks to design, build, and compete with a robot.",
      myRole: "Mechanical and design team member all four years. Mechanical lead and team lead as a senior.",
      action: "Worked on mechanical design and build each season, then led the mechanical group and the team as a whole in my final year.",
      result: "This is where I learned to build things with other people on a deadline, and why I chose robotics at Michigan."
    }
  ],

  /*
    Recommendations. Nothing here is a real quote yet.
    Replace each entry with words the person actually wrote, and set draft to false.
    Entries with draft: true show as empty slots so you can see the layout; delete them before you share the site.
  */
  testimonials: [
    { draft: true, quote: "", name: "Your manager at Milwaukee Tool", title: "Ask about the antenna study or the test bench" },
    { draft: true, quote: "", name: "Your supervisor at CEIT", title: "Ask about the brake monitoring firmware" },
    { draft: true, quote: "", name: "Your ARCAD Lab or ARV advisor", title: "Ask about leading the team" }
  ]
};
