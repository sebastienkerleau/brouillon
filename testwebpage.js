const circles = document.querySelectorAll('.circle');
let angles = [0, 0, 0, 0]; // Array to store angles for each radius, initialized to 0

circles.forEach((circle, circleIndex) => {
    const radii = circle.querySelectorAll('.radius');

    radii.forEach((radius, radiusIndex) => {
        let isDragging = false;
        let initialAngle;
        let initialPosition;
        let angleFromInitial = 0; // Variable to store the angle from initial position to current position

        // Mouse event listeners
        radius.addEventListener('mousedown', startDragging);
        document.addEventListener('mousemove', dragRadius);
        document.addEventListener('mouseup', stopDragging);

        // Touch event listeners
        radius.addEventListener('touchstart', startDragging);
        document.addEventListener('touchmove', dragRadius);
        document.addEventListener('touchend', stopDragging);

        function startDragging(e) {
            isDragging = true;
            e.preventDefault(); // Prevent default touch behavior (like scrolling)
        }

        function dragRadius(e) {
            if (isDragging) {
                let event;
                if (e.type === 'touchmove') {
                    event = e.touches[0]; // For touch events, get the first touch point
                } else {
                    event = e; // For mouse events, use the event directly
                }

                rotateRadius(event);
            }
        }

        function stopDragging() {
            isDragging = false;
            // Reset initial angle and position after dragging stops
            initialAngle = undefined;
            initialPosition = undefined;
        }

        function rotateRadius(event) {
            const rect = circle.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Calculate initial angle on first touch/mouse down
            if (!initialPosition) {
                initialPosition = {
                    x: event.clientX || event.touches[0].clientX,
                    y: event.clientY || event.touches[0].clientY
                };
                initialAngle = Math.atan2(initialPosition.y - centerY, initialPosition.x - centerX);
            }

            // Calculate current angle based on initial angle and current touch/mouse position
            const currentAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
            angleFromInitial = currentAngle - initialAngle;

            // Ensure angleFromInitial is between 0 and 2pi radians
            if (angleFromInitial < 0) {
                angleFromInitial += 2 * Math.PI;
            }

            // Update the rotation of the radius element
            radius.style.transform = `translateX(-50%) rotate(${angleFromInitial}rad)`;
            radius.style.transformOrigin = 'bottom';

            // Store the angle in the angles array
            angles[radiusIndex] = angleFromInitial;

            updateDisplay();
        }

        function updateDisplay() {
            // Update variables a, b, c, d based on sorted angles
            const sortedAngles = [...angles].sort((a, b) => a - b);
            const a = sortedAngles[0];
            const b = sortedAngles[1];
            const c = sortedAngles[2];
            const d = sortedAngles[3];

            // Calculate (b-a)/2, (c-b)/2, (d-c)/2, (2π-d+a)/2
            const deltaBA = (b - a) / 2;
            const deltaCB = (c - b) / 2;
            const deltaDC = (d - c) / 2;
            const deltaDA = (2 * Math.PI - d + a) / 2;

            // Find the largest value among (b-a)/2, (c-b)/2, (d-c)/2, (2π-d+a)/2
            const maxDelta = Math.max(deltaBA, deltaCB, deltaDC, deltaDA);

            // Calculate the cosine of the largest value
            const cosineValue = Math.cos(maxDelta);

            // Display the cosine value
            document.getElementById('cosine').textContent = `${cosineValue.toFixed(2)}`;

            // Check positive basis condition
            const isPositiveBasis = (a < b && b < c && c < d) &&
                                    (a + 3.04 < c && c < a + 3.24) &&
                                    (b + 3.04 < d && d < b + 3.24);

            // Check for "Positive basis of size three !" condition
            if (!isPositiveBasis && cosineValue > 0.001) {
                if ((a <= b && b <= a + 0.02) || (b <= c && c <= b + 0.02) || (c <= d && d <= c + 0.02)) {
                    document.getElementById('pssStatus').innerHTML = "Positive basis of size three !";
                } else {
                    document.getElementById('pssStatus').textContent = "PSS";
                }
            } else {
                // Display positive basis or PSS status
                document.getElementById('pssStatus').textContent = isPositiveBasis ? "positive basis" : "not PSS";
            }
        }

        // Initial display update
        updateDisplay();
    });
});
