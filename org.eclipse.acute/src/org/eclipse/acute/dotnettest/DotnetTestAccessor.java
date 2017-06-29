package org.eclipse.acute.dotnettest;


import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DotnetTestAccessor {

	/**
	 * Retrieves and returns a collection of all found tests using the `dotnet test
	 * --list-tests`command.
	 *
	 * @param projectFile:
	 *            File directed to the .csproj of the interested project
	 * @return Map<String, List<String>>: Contains the test class as the key and the
	 *         classe's test methods in list form as the value
	 */
	public static Map<String, List<String>> getTestMethods(File projectFile) {
		Map<String, List<String>> tests = new HashMap<>();
		if (projectFile == null || !projectFile.exists() || !(projectFile.isFile() || projectFile.isDirectory())) {
			return tests;
		}

		if (projectFile.isFile()) {
			projectFile = projectFile.getParentFile();
		}

		if (projectFile == null) {
			return tests;
		}

		try {
			ProcessBuilder restorePB;
			restorePB = new ProcessBuilder("dotnet", "restore");
			restorePB.directory(projectFile);
			Process restoreProcess = restorePB.start();
			restoreProcess.waitFor();

			if (restoreProcess.exitValue() != 0) { // errors will be shown in console
				return tests;
			}
		} catch (InterruptedException | IOException e) {
			return tests;
		}

		ProcessBuilder processBuilder;
		processBuilder = new ProcessBuilder("dotnet", "test", "--list-tests");
		processBuilder.directory(projectFile);

		try {
			Process process = processBuilder.start();

			try (BufferedReader in = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
				String inputLine;
				Boolean testsListExists = false;

				while ((inputLine = in.readLine()) != null) {
					if (inputLine.equals("The following Tests are available:")) {
						testsListExists = true;
						break;
					}
				}

				if (testsListExists) {
					while ((inputLine = in.readLine()) != null) {
						if (!inputLine.matches("\\s+.*")) {
							continue;
						}
						String FullyQualifiedName = inputLine.replaceFirst("\\s+", "").replaceAll("\\(.*\\)", "");
						int index = FullyQualifiedName.lastIndexOf('.');
						String className = FullyQualifiedName.substring(0, index);
						String methodName = FullyQualifiedName.substring(index + 1, FullyQualifiedName.length());
						List<String> methods = tests.get(className);
						if(methods == null) {
							methods = new ArrayList<>();
						} else if (methods.contains(methodName)) {
							continue;
						}
						methods.add(methodName);
						tests.put(className, methods);
					}
				}
				return tests;
			}
		} catch (IOException e) {
			e.printStackTrace();
			return tests;
		}
	}
}
